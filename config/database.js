// Database utilities and initialization
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/securepulse', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (err) {
    console.error('✗ MongoDB disconnection error:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
