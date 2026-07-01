const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/auth');
const Client = require('../models/Client');
const { logAudit } = require('../utils/auditLogger');

/**
 * GET /api/clients
 * Retrieve all clients managed by the authenticated advisor
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const clients = await Client.find({ advisorId: req.user.id })
      .sort({ name: 1 });
    res.json(clients);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/clients
 * Register a new client for the advisor
 */
router.post('/', [
  verifyToken,
  body('name').trim().notEmpty().withMessage('Client name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim(),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  body('dataConsentStatus').optional().isBoolean().withMessage('Data consent status must be boolean')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, status, dataConsentStatus } = req.body;

  try {
    const client = new Client({
      advisorId: req.user.id,
      name,
      email,
      phone,
      status: status || 'active',
      dataConsentStatus: dataConsentStatus || false
    });

    await client.save();

    // Create Audit Log
    await logAudit(
      req.user.id,
      'Create client',
      `Registered client ${name} (${email || 'no email'})`
    );

    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
