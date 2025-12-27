import { Router } from 'express';
import { createDelivery, getDeliveries } from '../controllers/deliveryController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createDelivery);
router.get('/', auth, getDeliveries);

export default router;
