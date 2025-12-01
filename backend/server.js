import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import farmRoutes from './routes/farms.js';
import cropRoutes from './routes/crops.js';
import buyerRoutes from './routes/buyers.js';
import chatRoutes from './routes/chat.js';
import weatherRoutes from './routes/weather.js';
import aiRoutes from './routes/ai.js';
import { initializeData } from './utils/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Test route before database
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kisaan Mandi API is running',
    timestamp: new Date().toISOString()
  });
});

// Database connection (non-blocking)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaan-mandi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    // Initialize synthetic data (non-blocking)
    initializeData().catch(err => {
      console.error('Error initializing data:', err.message);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue but database features may not work');
    console.log('💡 Make sure MongoDB is running: mongod');
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('🚀 ========================================');
  console.log('');
});

