import { Router } from 'express';
import { getCourierBatches, validateOtp } from '../controllers/batchController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getCourierBatches);
router.post('/validate-otp', auth, validateOtp);

export default router;
