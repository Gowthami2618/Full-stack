import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/designspace';

    // If username and password provided and URI contains placeholders
    if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
        mongoUri = mongoUri
          .replace('<username>', encodeURIComponent(process.env.MONGODB_USERNAME))
          .replace('<password>', encodeURIComponent(process.env.MONGODB_PASSWORD));
      }
    }

    // Set serverSelectionTimeoutMS to fail quickly if connection is unreachable
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    return null;
  }
};

export default connectDB;
