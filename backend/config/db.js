import mongoose from 'mongoose';

// Disable mongoose query buffering globally to avoid buffering timeout errors when offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bapuji_surgicals';
  
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '==================================================');
    console.error('\x1b[31m%s\x1b[0m', 'DATABASE CONNECTION ERROR: Failed to connect to MongoDB');
    console.error('\x1b[31m%s\x1b[0m', `Error Details: ${error.message}`);
    console.error('\x1b[31m%s\x1b[0m', '==================================================');
    console.error('Please ensure:');
    console.error('1. MongoDB Server is installed and running on your system.');
    console.error('2. Or, configure MONGO_URI in your backend/.env to point to a MongoDB Atlas cluster.');
    console.error('==================================================');
    
    // In development mode, we print the error but do not force exit, to let other parts load
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
