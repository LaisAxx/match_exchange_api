import { Queue } from 'bullmq';
import { Order } from '../../orders/entities/orderEntity';
import { redisConnection } from './redisClient';

export const matchQueue = new Queue<Order>('match-queue', {
  connection: redisConnection,
});

export async function enqueueOrder(order: Order) {
  await matchQueue.add('process-order', order);
}
