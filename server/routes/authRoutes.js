import express from 'express';
import {
  isAuth,
  login,
  logout,
  register,
  resetPassword,
  sendResendOtp,
  sendVarifyOtp,
  verifyEmail,
} from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp', userAuth, sendVarifyOtp);
router.post('/verify-account', userAuth, verifyEmail);
router.get('/is-auth', userAuth, isAuth);
router.post('/reset-password', resetPassword);
router.post('/send-reset-otp', sendResendOtp);

export default router;
