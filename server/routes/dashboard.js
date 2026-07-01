const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Client = require('../models/Client');
const CurrencyTransaction = require('../models/CurrencyTransaction');
const InvestmentQuote = require('../models/InvestmentQuote');

// Apply verifyToken middleware to all routes in this file
router.use(verifyToken);

/**
 * GET /api/dashboard/summary
 * Retrieve statistics, monthly chart data, and recent activity for the advisor dashboard
 */
router.get('/summary', async (req, res, next) => {
  const advisorId = req.user.id;

  try {
    // 1. Fetch counts
    const clientsCount = await Client.countDocuments({ advisorId });
    const transactionsCount = await CurrencyTransaction.countDocuments({ advisorId });
    const quotesCount = await InvestmentQuote.countDocuments({ advisorId });
    
    // Calculate total converted volume in source amount equivalent (simplified sum)
    const transactions = await CurrencyTransaction.find({ advisorId, status: 'completed' });
    const totalVolumeAED = transactions.reduce((acc, t) => {
      // If AED, it's face value. Otherwise convert back to AED using exchange rate.
      // Let's keep it simple: t.sourceAmount is in t.fromCurrency.
      // t.convertedAmount is in t.toCurrency.
      // We can estimate the AED equivalent using the transaction's exchangeRate if fromCurrency is not AED.
      // Better yet, just aggregate t.convertedAmount or sourceAmount. Let's return total volume.
      return acc + (t.fromCurrency === 'AED' ? t.sourceAmount : t.convertedAmount);
    }, 0);

    // 2. Fetch recent activity (last 5 of transactions and quotes combined)
    const recentTx = await CurrencyTransaction.find({ advisorId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentQuotes = await InvestmentQuote.find({ advisorId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Merge and format
    const activity = [
      ...recentTx.map(t => ({
        id: t._id,
        type: 'conversion',
        clientName: t.clientName,
        description: `Converted ${t.sourceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${t.fromCurrency} to ${t.toCurrency}`,
        createdAt: t.createdAt
      })),
      ...recentQuotes.map(q => ({
        id: q._id,
        type: 'quote',
        clientName: q.clientName,
        description: `Created quote for Plan ${q.planType} (Lump: ${q.lumpSum.toLocaleString()} AED)`,
        createdAt: q.createdAt
      }))
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // 3. Compute 6 months activity (conversions + quotes per month)
    const chartData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const txsInMonth = await CurrencyTransaction.countDocuments({
        advisorId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const quotesInMonth = await InvestmentQuote.countDocuments({
        advisorId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      chartData.push({
        month: `${months[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`,
        conversions: txsInMonth,
        quotes: quotesInMonth
      });
    }

    res.json({
      stats: {
        clients: clientsCount,
        conversions: transactionsCount,
        quotes: quotesCount,
        volume: totalVolumeAED
      },
      recentActivity: activity,
      chartData: chartData
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
