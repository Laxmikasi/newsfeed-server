// File: routes/shareCountRoutes.js

const express = require('express');
const router = express.Router();
const shareCountController = require('../controllers/shareCountController');

// Route to handle incoming share counts data
router.post('/share-counts', shareCountController.receiveShareCounts);

module.exports = router;
