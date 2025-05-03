import { Worker } from 'bullmq';
import { redisConnection } from './redisClient';
import { MatchService } from '../../orders/services/matchingService';
import { Order } from '../../orders/entities/orderEntity';

export const matchWorker = new Worker<Order>(
  'match-queue',
  async job => {
    const order = job.data;
    const logPrefix = `[MATCH WORKER] OrderID: ${order.id} | User: ${order.username} | Type: ${order.type.toUpperCase()} | Price: ${order.price} | Amount: ${order.amount}`;

    console.log(`${logPrefix} ➜ Iniciando processamento`);

    try {
      await MatchService.processNewOrder(order);
      console.log(`${logPrefix} ✅ Processamento concluído`);
    } catch (err) {
      console.error(`${logPrefix} ❌ Erro no processamento:`, err);
    }
  },
  { connection: redisConnection }
);
