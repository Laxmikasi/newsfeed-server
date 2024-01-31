const User = require('../models/userModel');
const Post = require('../models/postModel');
const multer = require('multer');
// const { default: MyPost } = require('../../client/src/Components/Mypost');

const getFileType = (mimeType) => {
  const splitMimeType = mimeType.split('/');
  return splitMimeType[1] || null;
};


const storage = multer.diskStorage({
  destination: 'uploads/', // Choose a folder to store uploaded files
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

exports.addPost =  async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    const userId = req.user.id;
    
    const type = getFileType(req.file.mimetype);
    const { title, subtitle, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const timestamp = req.body.timestamp ? new Date(req.body.timestamp) : new Date();
    const customer = await User.findById(userId);
    // console.log('Result of User.findOne:', customer);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const newPost = new Post({

      title,
      type,
      content,
      image,

      Author : { 
        UserId : customer._id,
        ProfilePicture:customer.profilePicture,
        Name: `${customer.firstName} ${customer.lastName}`
  }
     
      });
    
    await newPost.save();
    console.log('New Post Document:', newPost);


    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving post data:', error.message);
    res.status(500).json({ error: 'Error saving post data.' });
    console.error('Error saving post data:', error.message);
    res.status(500).json({ error: 'Error saving post data.' });
  }
};

exports.likePost = async(req, res) =>{
  try {

      // accessing ids from like route
      const postId = req.params.postId;
      const userId = req.user.id;

      // checking id's validitity in the database
      const postExist = await Post.findById(postId);
      const userExist = await User.findById(userId);

      if(!postExist){
          return res.status(400).json({message: "Post not found"});
      }

      if(!userExist){
          return res.status(400).json({message: "User not found"});
      }

      // checking if user already liked the post in the past
      if(postExist.likedBy.includes(userId)){
          return res.status(400).json({message: "Post already liked"});
      }

      // checking if user already disliked then remove dislike
      if(postExist.dislikedBy.includes(userId)){
          postExist.dislikedBy.pull(userId);
          postExist.dislikes -= 1;
      }

      // creating like and storing into the database
      postExist.likedBy.push(userId);
      postExist.likes += 1;

      const savedLikes = await postExist.save();
      res.status(200).json(savedLikes);
      
  } catch (error) {
      res.status(500).json({error: error});
  }
}


exports.dislikePost = async(req, res) =>{
  try {

      // accessing ids from dislike route
      const postId = req.params.postId;
      const userId = req.user.id;

      // checking id's validitity in the database
      const postExist = await Post.findById(postId);
      const userExist = await User.findById(userId);

      if(!postExist){
          return res.status(400).json({message: "Post not found"});
      }

      if(!userExist){
          return res.status(400).json({message: "User not found"});
      }

      if(postExist.dislikedBy.includes(userId)){
          return res.status(400).json({message: "Post already disliked"});
      }

      // checking if user already liked then remove like
      if(postExist.likedBy.includes(userId)){
          postExist.likedBy.pull(userId);
          postExist.likes -= 1;
      }

      // creating dislike and storing into the database
      postExist.dislikedBy.push(userId);
      postExist.dislikes += 1;

      const savedDislikes = await postExist.save();
      res.status(200).json(savedDislikes);
      
  } catch (error) {
      res.status(500).json({error: error});
  }
}


exports.readPosts= async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



exports.commentPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { text } = req.body; // Change to { text }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (text && typeof text === 'string' && text.trim() !== '') {
      // Change here to include userId in the postedBy field
      post.comments.push({ text, postedBy: userId });
       const savedComments = await post.save();
      return res.status(200).json( savedComments);
    } else {
      return res.status(400).json({ error: 'Invalid comment text' });
    }
  } catch (error) {
    console.error('Error commenting on media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Use filter to exclude the comment with the specified commentId
    post.comments = post.comments.filter(comment => comment._id != commentId);

    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error: Could not delete comment' });
  }
};



exports.updateComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const newText = req.body.text; // Assuming you send the updated text in the request body

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.text = newText;
    await post.save();

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
