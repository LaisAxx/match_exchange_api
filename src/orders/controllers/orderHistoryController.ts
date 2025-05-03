import { Request, Response } from 'express';
import { OrderHistoryService } from '../services/orderHistoryService';

export class OrderHistoryController {
  static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const username = (req as any).user.username;
      const matches = await OrderHistoryService.getUserHistory(username);
      res.json(matches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao obter histórico do usuário.' });
    }
  }
}
