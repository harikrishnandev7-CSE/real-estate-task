import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  let mongoUri = env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    // If DNS SRV resolution fails on Windows for cluster0.agt0xp3.mongodb.net, fallback to standard direct connection string
    if (error.code === 'ECONNREFUSED' || error.message?.includes('querySrv') || error.message?.includes('ECONNREFUSED')) {
      console.warn(`⚠️ SRV DNS lookup blocked by Windows/Network. Falling back to direct cluster connection...`);
      const fallbackUri = "mongodb://harish007krishnan_db_user:QFZ9ggZp1HpIqi91@ac-443ujan-shard-00-00.agt0xp3.mongodb.net:27017,ac-443ujan-shard-00-01.agt0xp3.mongodb.net:27017,ac-443ujan-shard-00-02.agt0xp3.mongodb.net:27017/realestate?ssl=true&authSource=admin&retryWrites=true&w=majority";
      try {
        const conn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`🍃 MongoDB Connected via Fallback: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (fallbackError) {
        console.error(`❌ MongoDB connection error: ${fallbackError.message}`);
        throw fallbackError;
      }
    }
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
