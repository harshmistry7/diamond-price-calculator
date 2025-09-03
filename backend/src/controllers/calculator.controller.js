import { z } from 'zod';
import Diamond from '../models/Diamond.js';

import { History } from '../models/History.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const SHAPES = ['Round', 'Pear']; // extend if needed
const COLORS = ['D','E','F','G','H','I','J','K','L','M','N'];
const CLARITIES = ['IF','VVS1','VVS2','VS1','VS2','SI1','SI2','SI3','I1','I2','I3'];

const calcSchema = z.object({
  shape: z.string(),
  color: z.string(),
  clarity: z.string(),
  discount: z.coerce.number().min(-100).max(100).default(0),
  caratWeight: z.coerce.number().positive()
});

export const calculatePrice = asyncHandler(async (req, res) => {
  let { shape, color, clarity, discount, caratWeight } = calcSchema.parse(req.body);

  // Normalize
  shape = shape.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); // Round, Pear
  color = color.trim().toUpperCase();  // D, E, F...
  clarity = clarity.trim().toUpperCase(); // IF, VVS1...

  const diamond = await Diamond.findOne({
    shape,
    color,
    clarity,
    lowSize: { $lte: caratWeight },
    highSize: { $gte: caratWeight }
  });

  if (!diamond) {
    return res.status(200).json({ message: 'Price Not Available' });
  }

  const basePrice = diamond.price;
  const newPricePerCarat = basePrice - (basePrice * (discount / 100));
  const finalAmount = newPricePerCarat * caratWeight;

  const record = await History.create({
    shape,
    color,
    clarity,
    discount,
    caratWeight,
    basePrice,
    newPricePerCarat: Number(newPricePerCarat.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2))
  });

  res.json({
    basePrice,
    newPricePerCarat: Number(newPricePerCarat.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2)),
    historyId: record._id
  });
});
