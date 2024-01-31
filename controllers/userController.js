const User = require('../models/userModel');
const Post = require('../models/postModel');
const bcrypt = require("bcrypt");
const multer = require('multer');

const SALT_ROUNDS = 10;

exports.registerUser = async (req, res) => {
  const { firstName,lastName, email, phone, password } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user document
    const newUser = new User({
    firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    // Save the user document to the database
    await newUser.save();

    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Failed to register." });
  }
};

// exports.getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Fetch user details from the "users" collection and populate additional data
//     const user = await Post.findById(userId)
    

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({ error: "Failed to fetch user profile" });
//   }
// };



exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find posts where the Author.UserId matches the user's id
    const posts = await Post.find({
      'Author.UserId': userId
    });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "User not found or no posts available" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};


exports.readProfile= async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone } = req.body;
    
    let updateFields = { firstName, lastName, email, phone };

    // Check if a new profilePicture file is selected
    if (req.file) {
      updateFields.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};



exports.readAllUsers= async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};