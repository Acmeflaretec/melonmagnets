
const { OAuth2Client } = require('google-auth-library');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const twilio = require('twilio');
const fast2sms = require('fast-two-sms');

const dotenv = require('dotenv');
dotenv.config();


// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// const otpClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);  

// module.exports.signup = async (req, res) => {
//   const { username, password, email, phone } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const encryptedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       username,
//       password: encryptedPassword,
//       email,
//       phone,
//     });

//     const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
//       expiresIn: process.env.JWT_ACCESS_EXPIRY,
//     });

//     const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: process.env.JWT_REFRESH_EXPIRY,
//     });
//     return res.status(200).json({
//       message: "Registration successful",
//       data: { token: { accessToken, refreshToken }, user }
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error?.message ?? "Something went wrong" });
//   }
// };

// module.exports.signin = async (req, res) => {
//   const { email, password } = req.body;
//   console.log('email, password ',email, password );

//   try {
//     const user = await User.findOne({email});

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
   
//     if (!isPasswordValid) {
//       return res.status(404).json({ message: "Incorrect password" });
//     }

//     const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
//       expiresIn: process.env.JWT_ACCESS_EXPIRY,
//     });

//     const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: process.env.JWT_REFRESH_EXPIRY,
//     });
// // console.log(accessToken,refreshToken);
//     return res.status(200).json({
//       message: "Login successful",
//       data: { token: { accessToken, refreshToken }, user }
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error?.message ?? "Something went wrong" });
//   }
// };

module.exports.getCurrentUser = async (req, res) => {
  try {
    const _id = req.decoded._id;   
    console.log('getCurrentUser',_id);
    const currentUser = await User.findOne({ _id });
    if (!currentUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    return res.status(200).json({ data: currentUser, message: "User details fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: error?.message ?? "Something went wrong" });
  }
};






module.exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    // console.log('user',user);
    if (!user) {
      const encryptedPassword = await bcrypt.hash(email + process.env.JWT_ACCESS_SECRET, 10);
      console.log('encryptedPassword',encryptedPassword);
      user = await User.create({
        username: name,
        email,
        password: encryptedPassword,
      });
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });

    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY,
    });

    return res.status(200).json({
      message: "Login successful",
      token: { accessToken, refreshToken },
      user
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message ?? "Something went wrong" });
  }
};







// module.exports.sendOtp = async (req, res) => {
//   const { mobile } = req.body;
//   try {
//     const user = await User.findOne({ mobile });  
//     if (!user) {
//       const newUser = new User({ mobile });
//       await newUser.save();
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();    
//     console.log('otp',otp);
//     await otpClient.messages.create({
//       body: `Your verification code is ${otp}`,
//       // from: process.env.TWILIO_PHONE_NUMBER,
//       from: '+17576974650',    
//       to: mobile    
//     }).then(message => console.log(message.sid));

//     await User.updateOne({ mobile }, { otp });

//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Something went wrong" });
//   }
// };
    
// module.exports.verifyOtp = async (req, res) => {
//   const { mobile, otp } = req.body;
//   console.log('mobile, otp',mobile, otp);
//   try {
//     const user = await User.findOne({ mobile });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
//       expiresIn: process.env.JWT_ACCESS_EXPIRY,
//     });

//     const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: process.env.JWT_REFRESH_EXPIRY,
//     });

//     user.otp = null;  // Clear OTP after successful verification
//     await user.save();

//     return res.status(200).json({
//       message: "Login successful",
//       data: { token: { accessToken, refreshToken }, user }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Something went wrong" });
//   }
// };



let otpStore = {};

module.exports.sendOtp = async (req, res) => {
  const { number } = req.body;
  console.log('number',number);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('otp',otp);
  otpStore[number] = otp;

 
  const options = {   
    authorization: process.env.FAST2SMS_API_KEY,   
    message: `Your OTP is: ${otp}`,
    numbers: [number]
  };
  try {
    await fast2sms.sendMessage(options);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

module.exports.verifyOtp = async (req, res) => {    
  console.log('verifyOtp called');
  const { number, otp } = req.body;

  if (otpStore[number] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  let user = await User.findOne({ mobile:number });
  console.log('user12-',user);
  

  if (!user) {
    console.log('no user');
    user = new User({ mobile:number });
    await user.save();   
  }   else{
    console.log('userCoupons-',user.coupons);
  }   

  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });

  res.status(200).json({
    message: 'Login successful',
    data: { token: { accessToken, refreshToken }, user }
  });
};