const mongoose = require('mongoose');

const CurrencyTransactionSchema = new mongoose.Schema({
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  fromCurrency: {
    type: String,
    enum: ['AED', 'GBP', 'USD', 'EUR', 'BRL', 'JPY'],
    required: true
  },
  toCurrency: {
    type: String,
    enum: ['AED', 'GBP', 'USD', 'EUR', 'BRL', 'JPY'],
    required: true
  },
  sourceAmount: {
    type: Number,
    required: true,
    min: 3000,
    max: 50000
  },
  feeRate: {
    type: Number,
    required: true
  },
  feeAmount: {
    type: Number,
    required: true
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  convertedAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CurrencyTransaction', CurrencyTransactionSchema);
