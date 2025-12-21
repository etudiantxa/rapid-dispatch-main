import { Router } from 'express';
import { createDelivery, getDeliveries } from '../controllers/deliveryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createDelivery);
router.get('/', authMiddleware, getDeliveries);

export default router;
