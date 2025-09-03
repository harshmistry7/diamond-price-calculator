import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Diamond from "../models/Diamond.js";

dotenv.config();

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Read JSON file
    const data = JSON.parse(fs.readFileSync("data/diamonds.json", "utf-8"));

    // Format and validate data
    const formattedData = data
      .map((item) => {
        const price = Number(item.caratprice);
        if (isNaN(price)) return null; // skip invalid price

        return {
          shape: item.shape || "Unknown",
          lowSize: item.low_size ?? null,
          highSize: item.high_size ?? null,
          color: item.color ? item.color.toUpperCase() : "UNKNOWN",
          clarity: item.clarity ? item.clarity.toUpperCase() : "UNKNOWN",
          price: price,
          date: item.date ? new Date(item.date) : new Date(),
        };
      })
      .filter((item) => item !== null); // remove invalid entries

    // Clear existing data
    await Diamond.deleteMany();
    console.log("✅ Existing diamonds deleted");

    // Insert new data
    await Diamond.insertMany(formattedData);
    console.log("✅ Diamonds imported successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
};

importData();
