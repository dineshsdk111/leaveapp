const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = generateOTP();

    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2>🔐 Password Reset</h2>
        </div>
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; text-align: center;">
          <p>Your OTP for password reset is:</p>
          <h1 style="color: #1e40af; letter-spacing: 8px; font-size: 36px; margin: 20px 0;">${otp}</h1>
          <p style="color: #64748b;">Valid for 10 minutes</p>
          <hr style="border: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px;">IT Department - SRM Easwari Engineering College</p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Password Reset OTP - IT Leave Portal', html);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP and Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
