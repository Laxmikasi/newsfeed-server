
const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareCountController');

router.post('/:socialMedia', shareController.sharePost);

module.exports = router;
