import mongoose from 'mongoose';
import { env } from './env.js';

// Disable command buffering so queries fail/succeed immediately without 10-second hanging timeouts
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  let mongoUri = env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`====================================================`);
    console.log(`✅ MONGODB ATLAS CONNECTED SUCCESSFULLY!`);
    console.log(`🍃 Host: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    console.log(`====================================================`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Atlas SRV Lookup failed. Trying direct cluster fallback...`);
    const fallbackUri = "mongodb://harish007krishnan_db_user:QFZ9ggZp1HpIqi91@ac-443ujan-shard-00-00.agt0xp3.mongodb.net:27017,ac-443ujan-shard-00-01.agt0xp3.mongodb.net:27017,ac-443ujan-shard-00-02.agt0xp3.mongodb.net:27017/realestate?ssl=true&authSource=admin&retryWrites=true&w=majority";
    try {
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`====================================================`);
      console.log(`✅ MONGODB ATLAS CONNECTED SUCCESSFULLY (via Direct Cluster)!`);
      console.log(`🍃 Host: ${conn.connection.host}`);
      console.log(`📁 Database: ${conn.connection.name}`);
      console.log(`====================================================`);
      return conn;
    } catch (fallbackError) {
      console.warn(`⚠️ Atlas Cluster blocked by Network/IP Whitelist. Trying local MongoDB...`);
      const localUri = "mongodb://127.0.0.1:27017/realestate";
      try {
        const conn = await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`====================================================`);
        console.log(`✅ LOCAL MONGODB CONNECTED SUCCESSFULLY!`);
        console.log(`🍃 Host: 127.0.0.1`);
        console.log(`📁 Database: realestate`);
        console.log(`====================================================`);
        return conn;
      } catch (localError) {
        console.log(`====================================================`);
        console.log(`⚠️ MONGODB CONNECTION NOTICE:`);
        console.log(`📌 Reason: MongoDB Atlas IP is not whitelisted & local MongoDB is inactive.`);
        console.log(`👉 To connect Atlas: Go to cloud.mongodb.com -> Network Access -> Add IP Address (0.0.0.0/0).`);
        console.log(`====================================================`);
        return null;
      }
    }
  }
};

export default connectDB;
