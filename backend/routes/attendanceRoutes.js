const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticateUser = require('../middleware/auth');

router.post('/check-in', authenticateUser, attendanceController.checkIn);
router.post('/check-out', authenticateUser, attendanceController.checkOut);
router.get('/report', authenticateUser, attendanceController.getAttendanceReport);

module.exports = router; 