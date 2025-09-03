import { Diamond } from "../models/Diamond.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { z } from "zod";

const querySchema = z.object({
  shape: z.string().optional(),
  color: z.string().optional(),
  clarity: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().default("price"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const getDiamonds = asyncHandler(async (req, res) => {
  const parsed = querySchema.parse(req.query);

  const filter = {};
  if (parsed.shape)
    filter.shape = parsed.shape
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  if (parsed.color) filter.color = parsed.color.trim().toUpperCase();
  if (parsed.clarity) filter.clarity = parsed.clarity.trim().toUpperCase();

  if (parsed.minPrice || parsed.maxPrice) {
    filter.price = {};
    if (parsed.minPrice) filter.price.$gte = parsed.minPrice;
    if (parsed.maxPrice) filter.price.$lte = parsed.maxPrice;
  }

  const sort = { [parsed.sortBy]: parsed.order === "asc" ? 1 : -1 };

  const skip = (parsed.page - 1) * parsed.limit;
  const [items, total] = await Promise.all([
    Diamond.find(filter).sort(sort).skip(skip).limit(parsed.limit),
    Diamond.countDocuments(filter),
  ]);

  res.json({
    page: parsed.page,
    limit: parsed.limit,
    total,
    items,
  });
});
