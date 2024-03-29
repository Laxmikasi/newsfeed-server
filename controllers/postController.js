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





exports.likeComment = async(req, res) =>{
  try {

      // accessing ids from like route
      const postId = req.params.postId;
      const userId = req.user.id;
      const commentId= req.params.commentId

      // checking id's validitity in the database
      const postExist = await Post.findById(postId);
      const userExist = await User.findById(userId);

      const commentExist = postExist.comments.id(commentId);


      if(!postExist){
          return res.status(400).json({message: "Post not found"});
      }
      if(!commentExist){
        return res.status(400).json({message: "Post not found"});
    }


      if(!userExist){
          return res.status(400).json({message: "User not found"});
      }

      // checking if user already liked the post in the past
      if(commentExist.likedBy.includes(userId)){
          return res.status(400).json({message: "comment already liked"});
      }

      // checking if user already disliked then remove dislike
      if(commentExist.dislikedBy.includes(userId)){
          commentExist.dislikedBy.pull(userId);
          commentExist.dislikes -= 1;
      }

      // creating like and storing into the database
      commentExist.likedBy.push(userId);
      commentExist.likes += 1;

      const savedLikes = await postExist.save();
      res.status(200).json(savedLikes);
      
  } catch (error) {
      res.status(500).json({error: error});
  }
}





exports.dislikeComment = async(req, res) =>{
  try {

      // accessing ids from like route
      const postId = req.params.postId;
      const userId = req.user.id;
      const commentId= req.params.commentId

      // checking id's validitity in the database
      const postExist = await Post.findById(postId);
      const userExist = await User.findById(userId);

      const commentExist = postExist.comments.id(commentId);


      if(!postExist){
          return res.status(400).json({message: "Post not found"});
      }
      if(!commentExist){
        return res.status(400).json({message: "Post not found"});
    }


      if(!userExist){
          return res.status(400).json({message: "User not found"});
      }

      // checking if user already liked the post in the past
      if(commentExist.dislikedBy.includes(userId)){
          return res.status(400).json({message: "comment already disliked"});
      }

      // checking if user already disliked then remove dislike
      if(commentExist.likedBy.includes(userId)){
          commentExist.likedBy.pull(userId);
          commentExist.likes -= 1;
      }

      // creating like and storing into the database
      commentExist.dislikedBy.push(userId);
      commentExist.dislikes += 1;

      const savedLikes = await postExist.save();
      res.status(200).json(savedLikes);
      
  } catch (error) {
      res.status(500).json({error: error});
  }
}



exports.replayToComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const commentId = req.params.commentId;
    const text = req.body.text;
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' }); // Return 404 if comment not found
    }

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' }); // Return 404 if comment not found
    }

    

    if (text && typeof text === 'string' && text.trim() !== '') {
      comment.replays.push({ text, replyedBy: userId });
      
      const savedReplys = await post.save();
      return res.status(200).json( savedReplys);
      
    } else {
      return res.status(400).json({ error: 'Invalid replay text' });
    }
  } catch (error) {
    console.error('Error replaying to comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.viewCount = async (req, res) => {
  try {
    // Find the post by its ID
    const postId = req.params.postId;
    const userId = req.user.id;
        
     const post = await Post.findById(postId);
  
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
     
    // Increment the views count
    post.views += 1;

    // Save the updated post
    const savedViews = await post.save();

    return res.status(200).json(savedViews);
  } catch (error) {
    console.error("Error incrementing views count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.shareCount = async (req, res) => {
  try {
    // Find the post by its ID
    const postId = req.params.postId;
    const userId = req.user.id;
        
     const post = await Post.findById(postId);
  
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
     
    // Increment the views count
    post.shareCount += 1;

    // Save the updated post
    const savedShareCounts = await post.save();

    return res.status(200).json(savedShareCounts);
  } catch (error) {
    console.error("Error incrementing views count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error: Could not delete post' });
  }
};


exports.editPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content, timestamp } = req.body;

    let updateFields = {
      title,
      content,
      timestamp
    };

    if (req.file) {
      // If there's an image attached, handle it accordingly
      updateFields.image = `/uploads/${req.file.filename}`; // Adjust this based on how you store images
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateFields, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Internal Server Error: Could not edit post' });
  }
};
