const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const User = require('../models/User');
const Client = require('../models/Client');
const CurrencyTransaction = require('../models/CurrencyTransaction');
const InvestmentQuote = require('../models/InvestmentQuote');
const AuditLog = require('../models/AuditLog');
const SystemErrorLog = require('../models/SystemErrorLog');

// Apply auth and admin middleware to all routes in this file
router.use(verifyToken);
router.use(adminOnly);

/**
 * GET /api/admin/stats
 * Return overview statistics for the administrator dashboard
 */
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await Client.countDocuments();
    const totalTransactions = await CurrencyTransaction.countDocuments();
    const totalQuotes = await InvestmentQuote.countDocuments();
    const totalErrors = await SystemErrorLog.countDocuments();
    const totalAudits = await AuditLog.countDocuments();

    res.json({
      totalUsers,
      totalClients,
      totalTransactions,
      totalQuotes,
      totalErrors,
      totalAudits
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/users
 * Return all User documents (excluding password hashes)
 */
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/audit
 * Return the last 100 AuditLog entries populated with the user's name
 */
router.get('/audit', async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email role title')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/errors
 * Return the last 50 SystemErrorLog entries
 */
router.get('/errors', async (req, res, next) => {
  try {
    const errors = await SystemErrorLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(errors);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
