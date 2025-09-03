import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  if (!uri) throw new Error('MONGODB_URI is missing');

  await mongoose.connect(uri, {
    autoIndex: true,
    maxPoolSize: 20,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'diamond_calc', // ✅ explicitly set database
  });

  console.log('✅ MongoDB connected:', mongoose.connection.name);
};
