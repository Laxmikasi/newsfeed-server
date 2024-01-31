const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: 'uploads/', // Choose a folder to store uploaded files
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage });

// Define routes for appointments
router.post('/register', userController.registerUser);
router.get('/gallery', authMiddleware, userController.getUserPosts);
router.get('/profile', authMiddleware, userController.readProfile);
router.put('/profile',upload.single('profilePicture'), authMiddleware, userController.updateProfile);
router.get('/allUsers',  userController.readAllUsers);

module.exports = router;
