import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from '../config/emailTemplate.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: 'Missing Details',
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'User already exists',
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    //  User throw create a new user in database
    const user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // set max age for this cookies
    });

    // sending welcome email

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Patel',
      text: `Welcone to Patel website. Your account has been created with email id :${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.send({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: 'Invalid Email',
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // set max age for this cookies
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.send({ success: true, message: 'Logged Out' });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// send verification otp for account verify
export const sendVarifyOtp = async (req, res) => {
  try {
    const userid = req.user?.id;
    const user = await User.findById(userid);
    if (!user) {
      return res.json({
        success: false,
        message: 'User Not Found',
      });
    }
    if (user.isAccountVerified) {
      res.json({
        success: false,
        message: 'Account Already verified',
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      // text: `Your OTP is ${otp} . Verify your account using this OTP `,
      html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace(
        '{{email}}',
        user.email,
      ),
    };
    await transporter.sendMail(mailOption);
    res.json({
      success: true,
      message: 'Verification OTP send on Email',
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// verify email using otp
export const verifyEmail = async (req, res) => {
  const userid = req.user?.id;
  const { otp } = req.body;
  if (otp[0] === ' ') {
    res.json({
      success: false,
      message: 'reqiued all fileds of the otp',
    });
  }
  if (!userid || !otp) {
    res.json({
      success: false,
      message: 'Missing Details ',
    });
  }
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: 'Invalid OTP',
      });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: 'OTP Expired',
      });
    }
    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// check if user is authenticated

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// send password Reset OTP
export const sendResendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: 'Email is required',
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'User is not found',
      });
    }

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();
    const mailOption = {
      from: `"Patell" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: 'Password Reset OTP',
      //   text: `You have requested to reset your password.
      // Your One-Time Password (OTP) is: ${otp}

      // Please use this OTP to reset your password.
      // If you did not request this, please ignore this email.`,
      html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace(
        '{{email}}',
        user.email,
      ),
    };
    await transporter.sendMail(mailOption);
    return res.json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// verify the otp and reset the password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: 'Email, OTP, and new password are required',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: 'OTP Expired',
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuth = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: 'authnticate',
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
