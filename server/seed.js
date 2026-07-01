require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Client = require('./models/Client');
const CurrencyTransaction = require('./models/CurrencyTransaction');
const InvestmentQuote = require('./models/InvestmentQuote');
const AuditLog = require('./models/AuditLog');
const SystemErrorLog = require('./models/SystemErrorLog');
const ExchangeRateCache = require('./models/ExchangeRateCache');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/efcg';

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('Connected. Cleaning existing data...');
    
    // Clean all collections
    await User.deleteMany({});
    await Client.deleteMany({});
    await CurrencyTransaction.deleteMany({});
    await InvestmentQuote.deleteMany({});
    await AuditLog.deleteMany({});
    await SystemErrorLog.deleteMany({});
    await ExchangeRateCache.deleteMany({});

    console.log('Inserting users...');
    
    const advisorPasswordHash = await bcrypt.hash('advisor123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const advisor = new User({
      name: 'Mohammed Al Rashid',
      title: 'Senior Financial Advisor',
      email: 'advisor@efcg.ae',
      passwordHash: advisorPasswordHash,
      role: 'advisor'
    });

    const admin = new User({
      name: 'Sarah Hassan',
      title: 'System Administrator',
      email: 'admin@efcg.ae',
      passwordHash: adminPasswordHash,
      role: 'admin'
    });

    await advisor.save();
    await admin.save();

    console.log('Users created:');
    console.log(`- Advisor: advisor@efcg.ae / advisor123 (ID: ${advisor._id})`);
    console.log(`- Admin: admin@efcg.ae / admin123 (ID: ${admin._id})`);

    console.log('Inserting clients...');
    const clients = [
      {
        advisorId: advisor._id,
        name: 'Fatima Al Qasimi',
        email: 'fatima@qasimi.ae',
        phone: '+971 50 123 4567',
        status: 'active',
        dataConsentStatus: true
      },
      {
        advisorId: advisor._id,
        name: 'Al Maha Real Estate Corp',
        email: 'invest@almaha.ae',
        phone: '+971 4 450 9988',
        status: 'active',
        dataConsentStatus: true
      },
      {
        advisorId: advisor._id,
        name: 'John Miller',
        email: 'john.miller@globex.com',
        phone: '+971 52 888 1234',
        status: 'active',
        dataConsentStatus: false
      },
      {
        advisorId: advisor._id,
        name: 'Tariq Mahmood',
        email: 'tariq@mahmood.co',
        phone: '+971 2 600 7711',
        status: 'inactive',
        dataConsentStatus: true
      }
    ];

    await Client.insertMany(clients);
    console.log('4 client records seeded successfully.');

    // Add some sample transaction and quote history for nice initial graphs
    console.log('Seeding initial transaction and quote records...');
    
    // Add transactions spanning the past few months
    const sampleTxs = [];
    const now = new Date();
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'BRL'];
    const clientNames = ['Fatima Al Qasimi', 'Al Maha Real Estate Corp', 'John Miller'];
    
    for (let i = 0; i < 8; i++) {
      const monthOffset = Math.floor(i / 2);
      const txDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 15 - (i * 2));
      const amount = 5000 + (i * 4500);
      const fromCur = 'AED';
      const toCur = targetCurrencies[i % targetCurrencies.length];
      
      const rates = { USD: 0.272, EUR: 0.252, GBP: 0.215, JPY: 43.5, BRL: 1.5 };
      const rate = rates[toCur];
      const feeRate = amount <= 5000 ? 0.035 : amount <= 15000 ? 0.027 : amount <= 25000 ? 0.020 : 0.015;
      const feeAmount = amount * feeRate;
      const netAmount = amount - feeAmount;
      const convertedAmount = netAmount * rate;

      sampleTxs.push({
        advisorId: advisor._id,
        clientName: clientNames[i % clientNames.length],
        fromCurrency: fromCur,
        toCurrency: toCur,
        sourceAmount: amount,
        feeRate,
        feeAmount,
        exchangeRate: rate,
        convertedAmount,
        status: 'completed',
        createdAt: txDate
      });
    }

    await CurrencyTransaction.insertMany(sampleTxs);

    // Add sample quotes
    const sampleQuotes = [];
    for (let i = 0; i < 6; i++) {
      const monthOffset = Math.floor(i / 2);
      const quoteDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 12 - (i * 2));
      const lump = 15000 + (i * 12000);
      const monthly = 500 + (i * 400);
      const plan = (i % 3) + 1; // plans 1, 2, 3

      // Compute simple projections array
      const projections = [
        {
          years: 1,
          min: { value: lump + monthly * 12 * 1.02, profit: lump * 0.02, fees: 100, tax: 0, invested: lump + monthly * 12 },
          max: { value: lump + monthly * 12 * 1.05, profit: lump * 0.05, fees: 100, tax: 0, invested: lump + monthly * 12 }
        },
        {
          years: 5,
          min: { value: lump + monthly * 60 * 1.10, profit: lump * 0.10, fees: 500, tax: 0, invested: lump + monthly * 60 },
          max: { value: lump + monthly * 60 * 1.25, profit: lump * 0.25, fees: 500, tax: 0, invested: lump + monthly * 60 }
        },
        {
          years: 10,
          min: { value: lump + monthly * 120 * 1.20, profit: lump * 0.20, fees: 1000, tax: 0, invested: lump + monthly * 120 },
          max: { value: lump + monthly * 120 * 1.60, profit: lump * 0.60, fees: 1000, tax: 100, invested: lump + monthly * 120 }
        }
      ];

      sampleQuotes.push({
        advisorId: advisor._id,
        clientName: clientNames[i % clientNames.length],
        planType: plan,
        lumpSum: lump,
        monthlyContribution: monthly,
        projections,
        createdAt: quoteDate
      });
    }

    await InvestmentQuote.insertMany(sampleQuotes);
    console.log('Seeded sample transactional records for dashboard preview.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
