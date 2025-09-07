const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app.vercel.app'] 
    : ['http://localhost:4028', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('🚀 Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/training', require('./routes/training'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/process', require('./routes/process'));
app.use('/api/deploy', require('./routes/deployment'));
app.use('/api/kaggle', require('./routes/kaggle'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🇮🇳 Alok\'s AI Studio Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for public templates (no auth required)
app.get('/api/test/templates', async (req, res) => {
  try {
    const Template = require('./models/Template');
    const templates = await Template.find({ isPublic: true, isActive: true })
      .limit(5)
      .select('name description type difficulty');
    
    res.json({
      success: true,
      message: 'Templates retrieved successfully',
      data: { templates },
      count: templates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : {}
  });
});

// For Vercel serverless functions, we export the app instead of listening
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🌟 Alok's AI Studio Backend running on http://localhost:${PORT}`);
  });
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
      process.exit(1);
    } else {
      console.error('❌ Server Error:', error);
    }
  });
}

// Export the Express app for Vercel
module.exports = app;
