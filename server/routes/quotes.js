const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/auth');
const InvestmentQuote = require('../models/InvestmentQuote');
const { calculateAllProjections, validatePlanInputs, PLANS } = require('../services/projectionCalculator');
const { logAudit } = require('../utils/auditLogger');

/**
 * POST /api/quotes
 * Create and save an investment quote with full projection data.
 *
 * Validates inputs against Appendix 1 plan rules:
 *   Plan 1 – Basic Savings Plan
 *   Plan 2 – Savings Plan Plus
 *   Plan 3 – Managed Stock Investments
 */
router.post('/', [
  verifyToken,
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('planType')
    .isIn([1, 2, 3])
    .withMessage('Plan type must be 1, 2, or 3')
    .toInt(),
  body('lumpSum')
    .isFloat({ min: 0 })
    .withMessage('Lump sum must be a non-negative number')
    .toFloat(),
  body('monthlyContribution')
    .isFloat({ min: 0 })
    .withMessage('Monthly contribution must be a non-negative number')
    .toFloat()
], async (req, res, next) => {

  // express-validator errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { clientName, planType, lumpSum, monthlyContribution } = req.body;

  // Business-rule validation (Appendix 1 limits)
  const ruleError = validatePlanInputs(lumpSum, monthlyContribution, planType);
  if (ruleError) {
    return res.status(400).json({ message: ruleError });
  }

  try {
    const projections = calculateAllProjections(lumpSum, monthlyContribution, planType);

    const quote = new InvestmentQuote({
      advisorId: req.user.id,
      clientName,
      planType,
      lumpSum,
      monthlyContribution,
      projections
    });

    await quote.save();

    await logAudit(
      req.user.id,
      'Create investment quote',
      `${PLANS[planType].name} for ${clientName}. Lump: ${lumpSum} AED, Monthly: ${monthlyContribution} AED.`
    );

    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/quotes
 * Return all quotes created by the authenticated advisor, newest first.
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const quotes = await InvestmentQuote
      .find({ advisorId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
