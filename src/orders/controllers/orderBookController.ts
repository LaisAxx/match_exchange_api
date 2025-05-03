import { Request, Response } from 'express';
import { OrderBookService } from '../services/orderBookService';

export class OrderBookController {
  static async getBook(req: Request, res: Response): Promise<void> {
    try {
      const book = await OrderBookService.getOrderBook();
      res.json(book);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar book de ordens.' });
    }
  }
}
