import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  getUserSubscription
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.get('/subscription', verifyToken, getUserSubscription);

export default router; 