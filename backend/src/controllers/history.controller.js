import { History } from '../models/History.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

export const getHistory = asyncHandler(async (req, res) => {
  const { page, limit } = querySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    History.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    History.countDocuments()
  ]);

  res.json({ page, limit, total, items });
});

export const clearHistory = asyncHandler(async (req, res) => {
  await History.deleteMany({});
  res.json({ message: 'History cleared' });
});
