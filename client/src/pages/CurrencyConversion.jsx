import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Coins,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Percent,
  Sparkles,
  Zap,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function CurrencyConversion() {
  const navigate = useNavigate();

  const currencies = ['AED', 'GBP', 'USD', 'EUR', 'BRL', 'JPY'];

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [customClientName, setCustomClientName] = useState('');
  const [fromCurrency, setFromCurrency] = useState('AED');
  const [toCurrency, setToCurrency] = useState('USD');
  const [sourceAmount, setSourceAmount] = useState('');

  const [rates, setRates] = useState({});
  const [ratesWarning, setRatesWarning] = useState('');
  const [loadingRates, setLoadingRates] = useState(true);

  const [calculation, setCalculation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [ratesRes, clientsRes] = await Promise.all([
          api.get('/rates'),
          api.get('/clients')
        ]);
        setRates(ratesRes.data.rates);
        if (ratesRes.data.warning) setRatesWarning(ratesRes.data.warning);
        setClients(clientsRes.data || []);
      } catch (err) {
        setErrorMsg('Failed to load real-time exchange rates. Please check connection.');
      } finally {
        setLoadingRates(false);
      }
    }
    loadData();
  }, []);

  const amountNum = parseFloat(sourceAmount) || 0;
  let activeTierIndex = -1;
  if (amountNum > 0) {
    if (amountNum <= 5000) activeTierIndex = 0;
    else if (amountNum <= 15000) activeTierIndex = 1;
    else if (amountNum <= 25000) activeTierIndex = 2;
    else activeTierIndex = 3;
  }

  const getFeeRate = (amount) => {
    if (amount <= 5000)  return 0.035;
    if (amount <= 15000) return 0.027;
    if (amount <= 25000) return 0.020;
    return 0.015;
  };

  const handleCalculate = (e) => {
    e?.preventDefault();
    setErrorMsg(''); setSuccessMsg(''); setCalculation(null);
    if (!selectedClient && !customClientName) { setErrorMsg('Please select or input a client name.'); return; }
    if (fromCurrency === toCurrency) { setErrorMsg('Source and target currencies must be different.'); return; }
    const val = parseFloat(sourceAmount);
    if (isNaN(val) || val < 3000 || val > 50000) { setErrorMsg('Transaction amount must be between 3,000 and 50,000 AED/equivalent.'); return; }
    const fromRate = rates[fromCurrency], toRate = rates[toCurrency];
    if (!fromRate || !toRate) { setErrorMsg('Exchange rates are currently unavailable.'); return; }

    const exchangeRate   = toRate / fromRate;
    const feeRate        = getFeeRate(val);
    const feeAmount      = val * feeRate;
    const netAmount      = val - feeAmount;
    const convertedAmount = netAmount * exchangeRate;

    setCalculation({
      clientName: selectedClient || customClientName,
      fromCurrency, toCurrency,
      sourceAmount: val, feeRate, feeAmount,
      netAmount, exchangeRate, convertedAmount,
      chartData: [
        { name: 'Net Amount',  value: netAmount  },
        { name: 'Advisory Fee', value: feeAmount }
      ]
    });
  };

  const handleSave = async () => {
    if (!calculation || saving) return;
    setErrorMsg(''); setSuccessMsg(''); setSaving(true);
    try {
      await api.post('/transactions', {
        clientName:   calculation.clientName,
        fromCurrency: calculation.fromCurrency,
        toCurrency:   calculation.toCurrency,
        sourceAmount: calculation.sourceAmount
      });
      setSuccessMsg('Transaction successfully executed and saved in the ledger!');
      setSourceAmount(''); setSelectedClient(''); setCustomClientName(''); setCalculation(null);
      setTimeout(() => navigate('/history'), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setSaving(false);
    }
  };

  const CHART_COLORS = ['#6F3BFD', '#FB315D'];

  // Tiers with distinct colors per tier
  const tiers = [
    { range: '≤ 5,000 AED',        rate: '3.50%', desc: 'Standard Tier',         badgeClass: 'badge-coral',  accentColor: '#FB315D', bgColor: 'rgba(251,49,93,0.08)',   borderColor: 'rgba(251,49,93,0.25)' },
    { range: '5,001 – 15,000 AED', rate: '2.70%', desc: 'Advisory Value Tier',   badgeClass: 'badge-purple', accentColor: '#8B63FF', bgColor: 'rgba(111,59,253,0.08)', borderColor: 'rgba(111,59,253,0.25)' },
    { range: '15,001 – 25,000 AED',rate: '2.00%', desc: 'Premium Preferred Tier',badgeClass: 'badge-teal',   accentColor: '#07E0B0', bgColor: 'rgba(7,224,176,0.08)',  borderColor: 'rgba(7,224,176,0.25)'  },
    { range: '> 25,000 AED',        rate: '1.50%', desc: 'Elite Sovereign Tier',  badgeClass: 'badge-gold',   accentColor: '#FFC228', bgColor: 'rgba(255,194,40,0.08)', borderColor: 'rgba(255,194,40,0.25)' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">
          Currency <span className="text-gradient-brand">Conversion</span> Planner
        </h2>
        <p className="text-textSecondary mt-1.5 text-sm">
          Convert client currency holdings using dynamic volume-incentivized fee tiers.
        </p>
      </div>

      {/* Alerts */}
      {ratesWarning && (
        <div className="flex items-center gap-3 p-4 bg-goldAccent/10 border border-goldAccent/20 text-goldAccent text-sm rounded-xl animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{ratesWarning}</p>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-coralAccent/10 border border-coralAccent/20 text-coralAccent text-sm rounded-xl animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-secondaryAccent/10 border border-secondaryAccent/20 text-secondaryAccent text-sm rounded-xl animate-scale-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Input Form ─────────────────────────────────────────────── */}
        <div className="card-interactive bg-cardBg rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primaryAccent/10 border border-primaryAccent/20 rounded-xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-primaryAccent" />
            </div>
            <div>
              <h3 className="font-bold text-textPrimary text-base">Transaction Parameters</h3>
              <p className="text-[11px] text-textMuted">Fill in the fields below to calculate fees</p>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Client selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondaryAccent/80 mb-2">
                  Linked Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => { setSelectedClient(e.target.value); if (e.target.value) setCustomClientName(''); }}
                  className="input-field input-field-teal w-full"
                >
                  <option value="">— Choose Existing Client —</option>
                  {clients.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primaryAccent/80 mb-2">
                  Or Enter Client Name
                </label>
                <input
                  type="text"
                  placeholder="Enter custom client name"
                  value={customClientName}
                  onChange={(e) => { setCustomClientName(e.target.value); if (e.target.value) setSelectedClient(''); }}
                  className="input-field w-full"
                />
              </div>
            </div>

            {/* Currency pair */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-goldAccent/80 mb-3">
                Currency Pair
              </label>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-textMuted mb-1.5">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="input-field input-field-gold w-full"
                  >
                    {currencies.map(cur => <option key={cur} value={cur}>{cur}</option>)}
                  </select>
                </div>

                <div className="flex flex-col items-center gap-1 mt-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primaryAccent/20 to-secondaryAccent/20 border border-primaryAccent/20 flex items-center justify-center shadow-glow">
                    <ArrowRightLeft className="w-4 h-4 text-primaryAccent" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-textMuted mb-1.5">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="input-field input-field-teal w-full"
                  >
                    {currencies.map(cur => <option key={cur} value={cur}>{cur}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-coralAccent/80 mb-2">
                Source Amount
                <span className="ml-2 text-textMuted/60 normal-case font-normal text-[10px]">Min: 3,000 / Max: 50,000</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-textMuted font-bold text-xs pointer-events-none z-10">
                  {fromCurrency}
                </span>
                <input
                  type="number"
                  min="3000" max="50000" step="any"
                  required
                  placeholder="10,000"
                  value={sourceAmount}
                  onChange={(e) => setSourceAmount(e.target.value)}
                  className="input-field w-full"
                  style={{ paddingLeft: '3.75rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Calculate Conversion Fees
            </button>
          </form>
        </div>

        {/* ── Fee Tiers ─────────────────────────────────────────────── */}
        <div className="card-interactive bg-cardBg rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-goldAccent/10 border border-goldAccent/20 rounded-xl flex items-center justify-center">
              <Percent className="w-5 h-5 text-goldAccent" />
            </div>
            <div>
              <h3 className="font-bold text-textPrimary text-base">EFCG Fee Schedule</h3>
              <p className="text-[10px] text-textMuted">Volume-based tiered pricing</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {tiers.map((tier, idx) => {
              const isActive = activeTierIndex === idx;
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3.5 rounded-xl border transition-all duration-400"
                  style={{
                    background: isActive ? tier.bgColor : 'rgba(17,27,46,0.6)',
                    borderColor: isActive ? tier.borderColor : 'rgba(26,39,64,0.5)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isActive ? `0 0 16px ${tier.accentColor}22` : 'none'
                  }}
                >
                  <div>
                    <p className="text-xs font-bold" style={{ color: isActive ? tier.accentColor : '#94A3B8' }}>
                      {tier.range}
                    </p>
                    <p className="text-[10px] text-textMuted mt-0.5">{tier.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black" style={{ color: isActive ? tier.accentColor : '#F1F5F9' }}>
                      {tier.rate}
                    </p>
                    {isActive && (
                      <span className={`badge ${tier.badgeClass} mt-1`}>Active</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Results View ────────────────────────────────────────────── */}
      {calculation && (
        <div className="card-interactive bg-cardBg rounded-2xl p-6 space-y-6 fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-goldAccent/10 border border-goldAccent/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-goldAccent animate-glow" />
            </div>
            <div>
              <h3 className="font-bold text-textPrimary text-lg">Advisory Valuation Results</h3>
              <p className="text-[11px] text-textMuted">Conversion breakdown for {calculation.clientName}</p>
            </div>
          </div>

          {/* 3 Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-in">
            {/* Fee card */}
            <div className="bg-surfaceBg border border-coralAccent/20 rounded-xl p-5 hover:border-coralAccent/40 hover:shadow-[0_0_20px_rgba(251,49,93,0.1)] transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-coralAccent/10 flex items-center justify-center">
                  <Percent className="w-3.5 h-3.5 text-coralAccent" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">
                  Advisory Fee ({(calculation.feeRate * 100).toFixed(2)}%)
                </p>
              </div>
              <p className="text-2xl font-black text-coralAccent">
                {calculation.feeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-semibold ml-1">{calculation.fromCurrency}</span>
              </p>
              <p className="text-[10px] text-textMuted mt-1.5">Deducted from source deposit</p>
            </div>

            {/* Net Amount card */}
            <div className="bg-surfaceBg border border-primaryAccent/20 rounded-xl p-5 hover:border-primaryAccent/40 hover:shadow-[0_0_20px_rgba(111,59,253,0.1)] transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primaryAccent/10 flex items-center justify-center">
                  <Coins className="w-3.5 h-3.5 text-primaryAccent" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Net Invested Amount</p>
              </div>
              <p className="text-2xl font-black text-primaryAccent">
                {calculation.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-semibold ml-1">{calculation.fromCurrency}</span>
              </p>
              <p className="text-[10px] text-textMuted mt-1.5">Converted at benchmark rate</p>
            </div>

            {/* Converted yield card */}
            <div className="bg-surfaceBg border border-secondaryAccent/20 rounded-xl p-5 hover:border-secondaryAccent/40 hover:shadow-[0_0_20px_rgba(7,224,176,0.1)] transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-secondaryAccent/10 flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5 text-secondaryAccent" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Converted Client Yield</p>
              </div>
              <p className="text-2xl font-black text-secondaryAccent">
                {calculation.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-semibold ml-1">{calculation.toCurrency}</span>
              </p>
              <p className="text-[10px] text-textMuted mt-1.5">
                Rate: 1 {calculation.fromCurrency} = {calculation.exchangeRate.toFixed(5)} {calculation.toCurrency}
              </p>
            </div>
          </div>

          {/* Chart + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculation.chartData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {calculation.chartData.map((entry, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `${Number(v).toLocaleString()} ${calculation.fromCurrency}`}
                    contentStyle={{ backgroundColor: '#0D1525', borderColor: '#1A2740', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-textPrimary text-sm border-b border-borderColor/40 pb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondaryAccent" />
                Verification Breakdown
              </h4>
              <table className="w-full text-xs text-left">
                <tbody>
                  {[
                    ['Client Account',    calculation.clientName],
                    ['Direction Pair',    `${calculation.fromCurrency} → ${calculation.toCurrency}`],
                    ['Base Rate',         `1.00 ${calculation.fromCurrency} = ${calculation.exchangeRate.toFixed(5)} ${calculation.toCurrency}`],
                  ].map(([label, val]) => (
                    <tr key={label} className="border-b border-borderColor/30">
                      <td className="py-2.5 text-textMuted font-medium">{label}</td>
                      <td className="py-2.5 text-right text-textPrimary font-semibold">{val}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2.5 text-textMuted font-medium">Compliance Status</td>
                    <td className="py-2.5 text-right"><span className="badge badge-teal">✓ Compliant</span></td>
                  </tr>
                </tbody>
              </table>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-success w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                    Executing...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save &amp; Execute Transfer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
