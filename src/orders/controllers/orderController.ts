import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { MatchService } from '../services/matchingService';
import { AppDataSource } from '../../db/data-source';
import { User } from '../../auth/authEntity';
import { OrderType } from 'orders/constants/orderTypes';

export class OrderController {
  static async listOrders(req: Request, res: Response) {
    try {
      const username = (req as any).user.username;
      const orders = await OrderService.listOrders(username);
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar ordens.' });
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      const username = (req as any).user.username;
      const { type, amount, price } = req.body;

      if (![OrderType.BUY, OrderType.SELL].includes(type)) {
        res.status(400).json({ message: 'Tipo de ordem inválido.' });
      } else {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ username });

        if (!user) {
          res.status(404).json({ message: 'Usuário não encontrado.' });
        } else {
          const totalCost = Number(price) * Number(amount);

          if (type === OrderType.BUY && user.usdBalance < totalCost) {
            res.status(400).json({ message: 'Saldo USD insuficiente.' });
          } else if (type === OrderType.SELL && user.btcBalance < Number(amount)) {
            res.status(400).json({ message: 'Saldo BTC insuficiente.' });
          } else {
            const newOrder = await OrderService.createOrder(username, type, amount, price);
            await MatchService.processNewOrder(newOrder);
            res.status(201).json(newOrder);
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao criar ordem.' });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const username = (req as any).user.username;
      const { id } = req.params;

      const success = await OrderService.cancelOrder(id, username);
      if (!success) {
        res.status(404).json({ message: 'Ordem não encontrada ou não pertence ao usuário.' });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cancelar ordem.' });
    }
  }
}
