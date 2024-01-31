

const express = require('express');
const multer = require('multer');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage });

// Define routes for appointments
router.post('/post',upload.single('image'), authMiddleware, postController.addPost);
router.post('/like/:postId',authMiddleware, postController.likePost);
router.post('/dislike/:postId',authMiddleware, postController.dislikePost);
router.post('/comment/:postId',authMiddleware, postController.commentPost);
router.get('/allPosts', postController.readPosts);
router.put('/comment/:postId/:commentId', authMiddleware, postController.updateComment);
router.delete('/comment/:postId/:commentId', authMiddleware, postController.deleteComment);

module.exports = router;

