import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateToken } from '../../common/authMiddleware'
import { OrderBookController } from '../controllers/orderBookController';
import { OrderHistoryController } from '../controllers/orderHistoryController';
import { OrderStatsController } from '../controllers/orderStatsController';

const router = Router();

router.get('/active', authenticateToken, OrderController.listOrders);
router.post('/', authenticateToken, OrderController.createOrder);
router.delete('/:id', authenticateToken, OrderController.cancelOrder);

router.get('/book', OrderBookController.getBook);
router.get('/history', authenticateToken, OrderHistoryController.getHistory);
router.get('/stats',  authenticateToken, OrderStatsController.getStats)

export default router;
