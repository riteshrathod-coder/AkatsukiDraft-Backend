import mongoose from 'mongoose';
import config from './env.js';

let isConnecting = false;

export const connectDB = async () => {
  // Return immediately if already connected
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Prevent duplicate simultaneous connection attempts
  if (isConnecting) {
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  if (!config.mongoUri || config.mongoUri.includes('localhost')) {
    if (process.env.NODE_ENV === 'production' || !process.env.MONGODB_URI) {
      console.warn('[DB Warning] MONGODB_URI is not set in environment variables!');
    }
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });
    console.log(`[DB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`);
    throw error;
  } finally {
    isConnecting = false;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('[DB] Disconnected');
};

export default connectDB;
