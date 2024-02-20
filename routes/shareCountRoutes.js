const express = require('express');
const router = express.Router();
const shareCountController = require('../controllers/shareCountController');

router.post('/share/:socialMedia', shareCountController.sharePost);

module.exports = router;
