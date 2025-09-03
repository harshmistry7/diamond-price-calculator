import { Router } from 'express';
import { getHistory, clearHistory } from '../controllers/history.controller.js';

const router = Router();

// GET /api/history?page=1&limit=20
router.get('/', getHistory);

// DELETE /api/history
router.delete('/', clearHistory);

export default router;
