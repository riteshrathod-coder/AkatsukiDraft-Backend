import dotenv from 'dotenv';
dotenv.config();

// Simple config object — reads from .env or falls back to defaults
const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/akatsuki_draft',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  jwtExpiresIn: '1d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'qwen/qwen3-coder-32b:free',
    baseUrl: 'https://openrouter.ai/api/v1',
  },
};

export default config;
