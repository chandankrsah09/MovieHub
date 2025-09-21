import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const conn = await mongoose.connect(DATABASE_URL);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
