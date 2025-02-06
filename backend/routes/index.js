import { Router } from 'express';
import { healthCheck, updateReading } from '../controllers/readingsController.js';

const router = Router();

router.get('/api/health', healthCheck);
router.patch('/api/readings/:id', updateReading);

export default router;