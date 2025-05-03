import { Router } from 'express';
import { authenticateToken } from '../common/authMiddleware';
import { UserController } from './userController';

const router = Router();

router.get('/', authenticateToken, UserController.getUser);

export default router;

