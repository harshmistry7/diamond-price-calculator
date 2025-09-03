import mongoose from "mongoose";

const diamondSchema = new mongoose.Schema({
  shape: {
    type: String,
    required: true,
  },
  lowSize: {
    type: Number,
    default: null, // in case it's missing
  },
  highSize: {
    type: Number,
    default: null,
  },
  color: {
    type: String,
    required: true,
    uppercase: true, // Normalize to uppercase (e.g., "D", "E")
  },
  clarity: {
    type: String,
    required: true,
    uppercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Diamond", diamondSchema);
