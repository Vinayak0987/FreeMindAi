// Simple register endpoint for testing
const mongoose = require('mongoose');

// Initialize MongoDB connection if not already connected
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('🚀 Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to database
    await connectDB();

    // Simple response for now
    return res.status(200).json({
      success: true,
      message: 'Register endpoint is working!',
      body: req.body,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
