const mongoose = require('mongoose');

const ProjectionMetricSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  profit: { type: Number, required: true },
  fees: { type: Number, required: true },
  tax: { type: Number, required: true },
  invested: { type: Number, required: true }
}, { _id: false });

const ProjectionYearSchema = new mongoose.Schema({
  years: { type: Number, required: true },
  min: { type: ProjectionMetricSchema, required: true },
  max: { type: ProjectionMetricSchema, required: true }
}, { _id: false });

const InvestmentQuoteSchema = new mongoose.Schema({
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
  planType: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  lumpSum: {
    type: Number,
    required: true
  },
  monthlyContribution: {
    type: Number,
    required: true
  },
  projections: [ProjectionYearSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InvestmentQuote', InvestmentQuoteSchema);
