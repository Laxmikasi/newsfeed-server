// routes/forgotRoutes.js
const express = require('express');
const forgotController = require('../controllers/forgotController');

const router = express.Router();

router.post('/forgot', forgotController.forgotPassword);
router.post('/reset-password/:id',forgotController.resetPassword);
router.post('/verify-otp', forgotController.verifyOtp);

module.exports = router;
