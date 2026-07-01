const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { logAudit } = require('../utils/auditLogger');
const verifyToken = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Log in a user (advisor or admin)
 */
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'efcg_super_secret_session_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Create Audit Log
    await logAudit(user._id, 'User login', `User logged in from IP ${req.ip}`);

    res.json({
      token,
      user: payload
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/register
 * Register a new advisor
 */
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      passwordHash,
      role: 'advisor', // default role
      title: 'Financial Advisor'
    });

    await user.save();

    // Generate JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'efcg_super_secret_session_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Create Audit Log
    await logAudit(user._id, 'User registration', `New user registered from IP ${req.ip}`);

    res.status(201).json({
      token,
      user: payload
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Logs out the current user by creating an audit log entry
 */
router.post('/logout', verifyToken, async (req, res, next) => {
  try {
    await logAudit(req.user.id, 'User logout', `User logged out successfully`);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
