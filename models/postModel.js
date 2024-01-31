const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   
   
        image:String,
        type:String,
         title:String ,
         subtitle: String ,
         content: String,
         likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },

        comments: [{ text: String ,
                    postedBy: { type: mongoose.Schema.Types.ObjectId,ref: "User"} ,
                    createdAt: { type: Date, default: Date.now },
                   }],
                   
        createdAt: { type: Date, default: Date.now },
        Author : { 
            UserId : String,
            ProfilePic : String, 
            Name : String
      
    },
    likedBy: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      }
  ],
  dislikedBy: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      }
    ]
         
   
  })
  
  const Post = mongoose.model('Post', postSchema);
  

module.exports = Post;
