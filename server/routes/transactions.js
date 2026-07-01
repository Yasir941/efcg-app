const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/auth');
const CurrencyTransaction = require('../models/CurrencyTransaction');
const { calcFeeRate } = require('../services/feeCalculator');
const { getExchangeRates } = require('../services/ratesService');
const { logAudit } = require('../utils/auditLogger');

/**
 * POST /api/transactions
 * Create a new currency conversion transaction
 */
router.post('/', [
  verifyToken,
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('fromCurrency').isIn(['AED', 'GBP', 'USD', 'EUR', 'BRL', 'JPY']).withMessage('Invalid source currency'),
  body('toCurrency').isIn(['AED', 'GBP', 'USD', 'EUR', 'BRL', 'JPY']).withMessage('Invalid target currency'),
  body('sourceAmount')
    .isFloat({ min: 3000, max: 50000 })
    .withMessage('Source amount must be between 3,000 and 50,000')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { clientName, fromCurrency, toCurrency, sourceAmount } = req.body;

  if (fromCurrency === toCurrency) {
    return res.status(400).json({ message: 'Source and target currencies must be different' });
  }

  try {
    // Get exchange rates
    const ratesResult = await getExchangeRates(req.user.id);
    const rates = ratesResult.rates;

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (!fromRate || !toRate) {
      return res.status(400).json({ message: 'Exchange rates not available for selected currencies' });
    }

    // Exchange rate fromCurrency -> toCurrency
    const exchangeRate = toRate / fromRate;

    // Calculate fee
    const feeRate = calcFeeRate(sourceAmount);
    const feeAmount = sourceAmount * feeRate;
    const netAmount = sourceAmount - feeAmount;
    const convertedAmount = netAmount * exchangeRate;

    const transaction = new CurrencyTransaction({
      advisorId: req.user.id,
      clientName,
      fromCurrency,
      toCurrency,
      sourceAmount,
      feeRate,
      feeAmount,
      exchangeRate,
      convertedAmount,
      status: 'completed'
    });

    await transaction.save();

    // Create Audit Log
    await logAudit(
      req.user.id,
      'Create currency transaction',
      `Converted ${sourceAmount} ${fromCurrency} to ${toCurrency} for client ${clientName}. Fee: ${feeAmount} ${fromCurrency}.`
    );

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/transactions
 * Retrieve all transactions created by the advisor
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const transactions = await CurrencyTransaction.find({ advisorId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
