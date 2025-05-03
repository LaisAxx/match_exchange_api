import { AppDataSource } from '../../db/data-source';
import { Order } from '../entities/orderEntity';
import { OrderType } from 'orders/constants/orderTypes';

export class OrderBookService {
  static async getOrderBook() {
    const repo = AppDataSource.getRepository(Order);

    const orders = await repo.find();

    const asksMap = new Map<number, number>();
    const bidsMap = new Map<number, number>();

    for (const order of orders) {
      const price = Number(order.price);
      const amount = Number(order.amount);

      if (order.type === OrderType.SELL) {
        asksMap.set(price, (asksMap.get(price) || 0) + amount);
      } else {
        bidsMap.set(price, (bidsMap.get(price) || 0) + amount);
      }
    }

    const asks = Array.from(asksMap.entries())
      .map(([price, amount]) => ({ price, amount }))
      .sort((a, b) => a.price - b.price); 

    const bids = Array.from(bidsMap.entries())
      .map(([price, amount]) => ({ price, amount }))
      .sort((a, b) => b.price - a.price); 

    return { asks, bids };
  }
}
