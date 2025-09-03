import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    shape: { type: String, required: true },
    color: { type: String, required: true },
    clarity: { type: String, required: true },
    discount: { type: Number, required: true },      // -100 to +100
    caratWeight: { type: Number, required: true },
    basePrice: { type: Number, required: true },     // store resolved base price for traceability
    newPricePerCarat: { type: Number, required: true },
    finalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

export const History = mongoose.model('History', historySchema);
