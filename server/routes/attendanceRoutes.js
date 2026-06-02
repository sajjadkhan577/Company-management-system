const express = require('express');
const router = express.Router();
const { getAttendance, checkIn, checkOut, getLeaves, createLeave, updateLeaveStatus } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAttendance);
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.route('/leaves').get(protect, getLeaves).post(protect, createLeave);
router.put('/leaves/:id', protect, authorize('Super Admin', 'Admin', 'HR Manager'), updateLeaveStatus);

module.exports = router;
