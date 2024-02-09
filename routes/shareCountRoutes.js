
const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareCountController');

router.post('share/:socialMedia', shareController.sharePost);

module.exports = router;
