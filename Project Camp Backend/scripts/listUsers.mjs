import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set');
  process.exit(1);
}

// load User model
const modelsPath = '../src/models/user.models.js';
const { User } = await import(modelsPath);

try {
  await mongoose.connect(MONGO_URI);
  const users = await User.find().select('-password').lean();
  console.log('Users:', users);
  await mongoose.connection.close();
} catch (err) {
  console.error('Error listing users', err);
  process.exit(1);
}
