const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/register/initiate', verifyToken, isAdmin, authController.initiateEmployeeRegistration);
router.post('/register/verify', verifyToken, isAdmin, authController.verifyEmployeeRegistration);
router.post('/login', authController.loginUser);

module.exports = router;