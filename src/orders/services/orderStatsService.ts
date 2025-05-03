import { AppDataSource } from '../../db/data-source';
import { Match } from '../entities/matchEntity';
import { User } from '../../auth/authEntity';
import { Between } from 'typeorm';

export class OrderStatsService {
  static async calculateStats(username: string) {
    const matchRepo = AppDataSource.getRepository(Match);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ username });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // estatísticas das últimas 24h
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const matches = await matchRepo.find({
      where: {
        created_at: Between(since, new Date()),
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!matches.length) {
      return {
        lastPrice: null,
        volumeBTC: 0,
        volumeUSD: 0,
        highestPrice: null,
        lowestPrice: null,
        userBalanceUSD: user.usdBalance,
        userBalanceBTC: user.btcBalance,
      };
    }

    const lastPrice = matches[0].price;
    const volumeBTC = matches.reduce((sum, m) => sum + Number(m.amount), 0);
    const volumeUSD = matches.reduce((sum, m) => sum + Number(m.amount) * Number(m.price), 0);
    const prices = matches.map(m => Number(m.price));
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);

    return {
      lastPrice,
      volumeBTC,
      volumeUSD,
      highestPrice,
      lowestPrice,
      userBalanceUSD: user.usdBalance,
      userBalanceBTC: user.btcBalance,
    };
  }
}
