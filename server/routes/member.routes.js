const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
  getMember,
  resetTiffinCounts,
  getExhaustedTiffinMembers,
  reactivateMember,
  recordPayment
} = require('../controllers/member.controller');

// All routes are protected and require authentication
router.use(verifyToken);

// Specific routes should come before parameterized routes
router.put('/reset-tiffin', resetTiffinCounts);
router.get('/exhausted-tiffin', getExhaustedTiffinMembers);

router.route('/')
  .post(addMember)
  .get(getMembers);

router.route('/:id')
  .get(getMember)
  .put(updateMember)
  .delete(deleteMember);

// Route for reactivating a member
router.put('/:id/reactivate', reactivateMember);

// Route for recording a payment
router.post('/:id/payment', recordPayment);

module.exports = router; 