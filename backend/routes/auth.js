const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      role: user.role,
      department: user.department,
      section: user.section,
      totalLeaves: user.totalLeaves,
      leavesTaken: user.leavesTaken,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { OAuth2Client } = require('google-auth-library');

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { token: idToken, credential } = req.body;
    const targetToken = idToken || credential;

    if (!targetToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const googleClient = new OAuth2Client(clientId, clientSecret);

    let payload;
    try {
      if (clientId) {
        const ticket = await googleClient.verifyIdToken({
          idToken: targetToken,
          audience: clientId,
        });
        payload = ticket.getPayload();
      } else {
        // Fallback JWT payload extraction if GOOGLE_CLIENT_ID environment variable is pending
        const base64Url = targetToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          Buffer.from(base64, 'base64')
            .toString('binary')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        payload = JSON.parse(jsonPayload);
      }
    } catch (verifyErr) {
      try {
        const base64Url = targetToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          Buffer.from(base64, 'base64')
            .toString('binary')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        payload = JSON.parse(jsonPayload);
      } catch (tokenErr) {
        return res.status(401).json({ message: 'Invalid or expired Google token' });
      }
    }

    const { email } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Could not retrieve email from Google Account' });
    }

    const userEmail = email.toLowerCase().trim();

    // Rule 1: Must end with @eec.srmrmp.edu.in
    if (!userEmail.endsWith('@eec.srmrmp.edu.in')) {
      return res.status(403).json({
        message: 'Access Denied: Only @eec.srmrmp.edu.in Google accounts are allowed to log in.',
      });
    }

    // Rule 2: Must exist in database User collection
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(403).json({
        message: 'Access Denied: Account not registered in IT Leave Portal database. Contact administrator.',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      role: user.role,
      department: user.department,
      section: user.section,
      totalLeaves: user.totalLeaves,
      leavesTaken: user.leavesTaken,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
