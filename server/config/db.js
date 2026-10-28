import mongoose from 'mongoose';
import config from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[DB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('[DB] Disconnected');
};

export default connectDB;
