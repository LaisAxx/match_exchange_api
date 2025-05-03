import { AppDataSource } from '../../db/data-source';
import { Order } from '../entities/orderEntity';
import { Match } from '../entities/matchEntity';
import { User } from '../../auth/authEntity';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { getIO } from '../../socket';
import { OrderType } from 'orders/constants/orderTypes';

function toFixed8(n: any): number {
    const num = Number(n);
    return Math.floor(num * 1e8) / 1e8;
}

function toFixed2(n: any): number {
    const num = Number(n);
    return Math.floor(num * 100) / 100;
}

export class MatchService {
    static async processNewOrder(newOrder: Order): Promise<void> {
        const orderRepo = AppDataSource.getRepository(Order);
        const userRepo = AppDataSource.getRepository(User);
        const matchRepo = AppDataSource.getRepository(Match);
        const io = getIO();

        const oppositeType = newOrder.type === OrderType.BUY ? OrderType.SELL : OrderType.BUY;

        const matchingOrders = await orderRepo.find({
            where: {
                type: oppositeType,
                price: newOrder.type === OrderType.BUY
                    ? LessThanOrEqual(newOrder.price)
                    : MoreThanOrEqual(newOrder.price),
            },
            order: {
                price: newOrder.type === OrderType.BUY ? 'ASC' : 'DESC',
            },
        });

        let remainingAmount = Number(newOrder.amount);

        for (const existingOrder of matchingOrders) {
            if (remainingAmount <= 0) break;

            const matchAmount = Math.min(remainingAmount, Number(existingOrder.amount));
            const matchPrice = Number(existingOrder.price);
            const total = matchAmount * matchPrice;

            const buyerName = newOrder.type === OrderType.BUY ? newOrder.username : existingOrder.username;
            const sellerName = newOrder.type === OrderType.SELL ? newOrder.username : existingOrder.username;

            const buyer = await userRepo.findOneBy({ username: buyerName });
            const seller = await userRepo.findOneBy({ username: sellerName });

            if (!buyer || !seller) continue;

            const takerFee = total * 0.003;
            const makerFee = total * 0.005;

            // Inicializa saldos se forem nulos ou indefinidos
            buyer.usdBalance = toFixed2(buyer.usdBalance ?? 0);
            buyer.btcBalance = toFixed8(buyer.btcBalance ?? 0);
            seller.usdBalance = toFixed2(seller.usdBalance ?? 0);
            seller.btcBalance = toFixed8(seller.btcBalance ?? 0);

            if (newOrder.type === OrderType.BUY) {
                // Buyer = taker
                buyer.usdBalance = toFixed2(buyer.usdBalance - (total + takerFee));
                buyer.btcBalance = toFixed8(buyer.btcBalance + matchAmount);

                seller.usdBalance = toFixed2(seller.usdBalance + (total - makerFee));
                seller.btcBalance = toFixed8(seller.btcBalance - matchAmount);
            } else {
                // Seller = taker
                seller.usdBalance = toFixed2(seller.usdBalance + (total - makerFee));
                seller.btcBalance = toFixed8(seller.btcBalance - matchAmount);
            }

            // Verifica se os saldos são números válidos
            if (
                isNaN(buyer.usdBalance) || isNaN(buyer.btcBalance) ||
                isNaN(seller.usdBalance) || isNaN(seller.btcBalance)
            ) {
                console.error('Erro: Saldo inválido detectado.');
                console.error('buyer:', buyer);
                console.error('seller:', seller);
                continue;
            }

            await userRepo.save([buyer, seller]);

            const match = matchRepo.create({
                buyer: buyer.username,
                seller: seller.username,
                price: matchPrice,
                amount: matchAmount,
            });
            await matchRepo.save(match);

            // Notificações via Socket.IO
            io.emit('matchExecuted', match);
            io.emit('orderBookUpdated');
            io.emit('statsUpdated');
            io.to(buyer.username).emit('yourOrderMatched', match);
            io.to(seller.username).emit('yourOrderMatched', match);

            // Atualiza a ordem existente
            existingOrder.amount = toFixed8(Number(existingOrder.amount) - matchAmount);
            if (existingOrder.amount <= 0) {
                await orderRepo.remove(existingOrder);
            } else {
                await orderRepo.save(existingOrder);
            }

            remainingAmount = toFixed8(remainingAmount - matchAmount);
        }

        // Se restar parte da nova ordem, salva no livro de ordens
        if (remainingAmount > 0) {
            newOrder.amount = toFixed8(remainingAmount);
            await orderRepo.save(newOrder);
            io.emit('orderBookUpdated');
        }
    }
}
