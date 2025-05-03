import { AppDataSource } from 'db/data-source';
import { Order } from '../entities/orderEntity';
import { OrderType } from 'orders/constants/orderTypes';

export class OrderService {
  static async listOrders(username: string): Promise<Order[]> {
    const repo = AppDataSource.getRepository(Order);
    return await repo.find({
      where: { username },
      order: { created_at: 'DESC' },
    });
  }

  static async createOrder(
    username: string,
    type: OrderType.BUY | OrderType.SELL,
    amount: number,
    price: number
  ): Promise<Order> {
    const repo = AppDataSource.getRepository(Order);
    const order = repo.create({
      username,
      type,
      amount,
      price,
    });
    return await repo.save(order);
  }

  static async cancelOrder(id: string, username: string): Promise<boolean> {
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOneBy({ id, username });

    if (!order) {
      return false;
    }

    await repo.remove(order);
    return true;
  }
}
