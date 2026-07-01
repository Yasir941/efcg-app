const mongoose = require('mongoose');

const ExchangeRateCacheSchema = new mongoose.Schema({
  baseCurrency: {
    type: String,
    default: 'AED'
  },
  rates: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('ExchangeRateCache', ExchangeRateCacheSchema);
