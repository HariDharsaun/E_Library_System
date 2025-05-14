import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const deleteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elibrary');
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('Admin user deleted');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error deleting admin:', error);
  }
  process.exit();
};

deleteAdmin();
