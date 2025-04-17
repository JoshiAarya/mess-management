const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { getMonthlyRevenue } = require('../controllers/stats.controller');

// All routes are protected and require authentication
router.use(verifyToken);

router.get('/monthly-revenue', getMonthlyRevenue);

module.exports = router;