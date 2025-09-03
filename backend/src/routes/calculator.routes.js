import { Router } from 'express';
import { calculatePrice } from '../controllers/calculator.controller.js';

const router = Router();

// POST /api/calculate
router.post('/', calculatePrice);

export default router;
