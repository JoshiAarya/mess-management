const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
  createOrUpdateAttendance,
  getAttendanceByDate,
  getAttendanceByMember,
  updateSingleAttendance,
  getTodaysAttendanceCount
} = require('../controllers/attendance.controller');

// All routes are protected and require authentication
router.use(verifyToken);

// Route for today's attendance count
router.get('/today/count', getTodaysAttendanceCount);

router.route('/')
  .post(createOrUpdateAttendance);

router.route('/:date')
  .get(getAttendanceByDate);

router.route('/member/:userId')
  .get(getAttendanceByMember);

// Route to update single attendance record
router.put('/:userId/:date/:meal', updateSingleAttendance);

module.exports = router; 