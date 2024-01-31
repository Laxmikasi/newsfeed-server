// controllers/ForgotController.js
const nodemailer = require('nodemailer');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');


function generateOTP(length) {
  const digits = '0123456789';
  let OTP = '';
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  
  return OTP;
}

exports.forgotPassword= (req, res) => {
  const {email} = req.body;

  UserModel.findOne({email: email})
  .then(user => {
      if(!user) {
          return res.send({Status: "User not existed"})
      } 

     
      const otp = generateOTP(6);

      console.log("Generated OTP:", otp);
      // Save OTP in the database or any other storage if needed
      user.otp = otp;
      user.save();
      const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})

      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'kasireddylaxmi66040@gmail.com',
            pass: 'vtdk habm egeb sbgg'
        }
        });
        
        var mailOptions = {
          from: 'kasireddylaxmi66040@gmail.com',
          to: email,
          subject: 'Reset Password Link',
          text: `Your OTP to reset password is: ${otp}`
          
        }
        
       
        console.log(mailOptions.to);


        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            return res.send({Status: "Success"})
          }
        });
  })
}

exports.verifyOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, otp } = req.body;
    
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });
    }
    return res.status(201).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Failed to verify OTP.' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const email  = req.params.id; // Assuming email is passed as a parameter
    const { password } = req.body;
 
    console.log('Received params:', req.params);
    console.log('Received password:', password);
    console.log('Received email:', email);

 
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ Status: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate({ _id: user._id }, { password: hashedPassword });

    res.send({ Status: "Success" });
  } catch (err) {
    res.send({ Status: err.message || "Error resetting password" });
  }
};
