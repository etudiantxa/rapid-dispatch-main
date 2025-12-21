import { Router } from 'express';
import { getAssignedBatches, validateOtp } from '../controllers/courierController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/batches', authMiddleware, getAssignedBatches);
router.post('/validate-otp', authMiddleware, validateOtp);

export default router;
