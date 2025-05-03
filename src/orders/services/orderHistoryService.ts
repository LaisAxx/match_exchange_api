import { AppDataSource } from '../../db/data-source';
import { Match } from '../entities/matchEntity';

export class OrderHistoryService {
  static async getUserHistory(username: string): Promise<any[]> {
    const matchRepo = AppDataSource.getRepository(Match);

    const matches = await matchRepo.find({
      where: [
        { buyer: username },
        { seller: username }
      ],
      order: {
        created_at: 'DESC'
      }
    });

    return matches.map((match) => ({
      id: match.id,
      amount: match.amount,
      price: match.price,
      created_at: match.created_at,
      buyer: match.buyer,
      seller: match.seller,
      type: match.buyer === username ? 'buy' : 'sell',
      status: 'filled' 
    }));
  }
}
