import express from 'express';
import {
  createMenu,
  getTodaysMenu,
  getMenuByDate,
  updateMenu,
  deleteMenu,
  getMenusByDateRange
} from '../controllers/menuController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/today', getTodaysMenu);
router.get('/date/:date', getMenuByDate);
router.get('/range', getMenusByDateRange);

// Protected admin routes
router.use(verifyToken, isAdmin);
router.post('/', createMenu);
router.put('/:menuId', updateMenu);
router.delete('/:menuId', deleteMenu);

export default router; 