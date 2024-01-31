const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController');


router.post('/login', LoginController.CreateLogin);

module.exports = router;
