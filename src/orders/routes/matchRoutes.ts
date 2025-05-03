import { Router } from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticateToken } from '../../common/authMiddleware'

const router = Router();

router.get('/', MatchController.listMatches); // GET /api/v1/matches

export default router;


