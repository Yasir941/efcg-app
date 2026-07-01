require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Route files
const authRoutes       = require('./routes/auth');
const rateRoutes       = require('./routes/rates');
const transactionRoutes = require('./routes/transactions');
const quoteRoutes      = require('./routes/quotes');
const clientRoutes     = require('./routes/clients');
const adminRoutes      = require('./routes/admin');
const dashboardRoutes  = require('./routes/dashboard');

// Global error handler
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── MongoDB Atlas ───────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env — aborting.');
  process.exit(1);
}

console.log('🔗 Connecting to MongoDB Atlas…');
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/rates',        rateRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/quotes',       quoteRoutes);
app.use('/api/clients',      clientRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/dashboard',    dashboardRoutes);

// Health check
app.get('/health', (_, res) =>
  res.json({ status: 'healthy', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', timestamp: new Date() })
);

// ── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────────────────
// Only boot up the local listener port if we are NOT deploying onto Vercel Production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 EFCG API  →  http://localhost:${PORT}`);
    console.log(`🔑 Demo logins:`);
    console.log(`   advisor@efcg.ae  /  advisor123`);
    console.log(`   admin@efcg.ae    /  admin123\n`);
  });
}

// ── Vercel Serverless Export ────────────────────────────────────────────────
module.exports = app;