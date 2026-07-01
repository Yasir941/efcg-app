const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getExchangeRates } = require('../services/ratesService');

/**
 * GET /api/rates
 * Fetch currency exchange rates (live from API, cached in Mongo, or fallback)
 */
router.get('/', verifyToken, async (req, res, next) => {
  const userId = req.user ? req.user.id : null;
  try {
    const result = await getExchangeRates(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
