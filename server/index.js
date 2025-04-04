import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import menuRoutes from './routes/menuRoutes.js';

// Load environment variables
dotenv.config();

// Log environment variables status (without exposing sensitive info)
console.log('Environment variables loaded:');
console.log('- PORT:', process.env.PORT ? 'Set ✓' : 'Not set ✗');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Not set ✗');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set ✓' : 'Not set ✗');
console.log('- CLIENT_URL:', process.env.CLIENT_URL ? 'Set ✓' : 'Not set ✗');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- ADMIN_KEY:', process.env.ADMIN_KEY ? 'Set ✓' : 'Not set ✗');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/menu', menuRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
