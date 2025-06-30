const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const verifyToken = require('../middleware/verifyToken');
const isEmployee = require('../middleware/isEmployee');

router.post('/clockin/initiate', verifyToken, isEmployee, attendanceController.initiateClockInOTP);
router.post('/clockin/verify', verifyToken, isEmployee, attendanceController.verifyClockInOTP);

module.exports = router;