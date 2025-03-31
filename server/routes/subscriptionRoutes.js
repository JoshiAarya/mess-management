import express from 'express';
import {
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
  cancelSubscription,
  getSubscriptionById
} from '../controllers/subscriptionController.js';
import { verifyToken, isAdmin, isOwnerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Admin routes
router.get('/', isAdmin, getAllSubscriptions);
router.post('/', isAdmin, createSubscription);

// Protected routes
router.get('/:subscriptionId', isOwnerOrAdmin, getSubscriptionById);
router.put('/:subscriptionId', isAdmin, updateSubscription);
router.delete('/:subscriptionId', isAdmin, cancelSubscription);

export default router; 