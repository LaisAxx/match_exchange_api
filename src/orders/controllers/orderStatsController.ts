import { Request, Response } from 'express';
import { OrderStatsService } from '../services/orderStatsService';

export class OrderStatsController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const username = req.user?.username;

      if (!username) {
        res.status(401).json({ message: 'Usuário não autenticado.' });
        return;
      }

      const stats = await OrderStatsService.calculateStats(username);
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao obter estatísticas.' });
    }
  }
}
