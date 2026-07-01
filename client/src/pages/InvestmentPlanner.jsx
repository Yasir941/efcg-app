import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  TrendingUp, CheckCircle, AlertCircle, Sparkles, Info,
  ShieldCheck, Calculator
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─────────────────────────────────────────────────────────────────────────────
// Appendix 1 – Official plan configuration
// ─────────────────────────────────────────────────────────────────────────────
const PLANS_CONFIG = {
  1: {
    name: 'Basic Savings Plan',
    minRate: 1.2,
    maxRate: 2.4,
    monthlyFeeRate: 0.25,
    minMonthly: 500,
    minLumpSum: 0,
    maxPerYear: 200000,
    taxDesc: '0% Tax-Free',
    desc: 'A conservative, capital-preservation plan with zero tax liability. Ideal for low-risk clients seeking steady, predictable growth.'
  },
  2: {
    name: 'Savings Plan Plus',
    minRate: 3.0,
    maxRate: 5.5,
    monthlyFeeRate: 0.3,
    minMonthly: 500,
    minLumpSum: 3000,
    maxPerYear: 300000,
    taxDesc: '10% on profit > 120,000 AED',
    desc: 'A balanced growth plan combining UAE bonds and global blue-chip equities. Moderate risk with competitive annual returns.'
  },
  3: {
    name: 'Managed Stock Investments',
    minRate: 4.0,
    maxRate: 23.0,
    monthlyFeeRate: 1.3,
    minMonthly: 1500,
    minLumpSum: 10000,
    maxPerYear: Infinity,
    taxDesc: '10% (>120k) / 20% (>400k AED profit)',
    desc: 'A high-growth, actively managed portfolio with exposure to international equities and alternative assets. Suitable for high-risk appetite clients.'
  }
};

function calcTax(profit, planType) {
  if (profit <= 0) return 0;
  if (planType === 1) return 0;
  if (planType === 2) return profit > 120000 ? (profit - 120000) * 0.10 : 0;
  if (planType === 3) {
    if (profit > 400000) return (280000 * 0.10) + ((profit - 400000) * 0.20);
    if (profit > 120000) return (profit - 120000) * 0.10;
    return 0;
  }
  return 0;
}

function runCompounding(lump, monthly, planType, years, rateType) {
  const cfg = PLANS_CONFIG[planType];
  const annualRate  = (rateType === 'min' ? cfg.minRate : cfg.maxRate) / 100;
  const monthlyRate = annualRate / 12;
  const feeMonthly  = cfg.monthlyFeeRate / 100;

  let balance = lump, totalFees = 0;
  const totalInvested = lump + monthly * years * 12;

  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + monthlyRate) + monthly;
    const fee = balance * feeMonthly;
    balance -= fee;
    totalFees += fee;
  }

  const profit = balance - totalInvested;
  return {
    value:    Math.max(0, balance),
    profit:   Math.max(0, profit),
    fees:     totalFees,
    tax:      calcTax(Math.max(0, profit), planType),
    invested: totalInvested
  };
}

function validateInputs(lump, monthly, planType) {
  const cfg = PLANS_CONFIG[planType];
  if (monthly < cfg.minMonthly)
    return `Minimum monthly contribution for this plan is ${cfg.minMonthly.toLocaleString()} AED.`;
  if (cfg.minLumpSum > 0 && lump < cfg.minLumpSum)
    return `Minimum initial lump sum for this plan is ${cfg.minLumpSum.toLocaleString()} AED.`;
  if (cfg.maxPerYear !== Infinity) {
    const annual = lump + monthly * 12;
    if (annual > cfg.maxPerYear)
      return `Total first-year investment (${annual.toLocaleString()} AED) exceeds the maximum of ${cfg.maxPerYear.toLocaleString()} AED/year for this plan.`;
  }
  return null;
}

const fmt = (n) => Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function InvestmentPlanner() {
  const navigate = useNavigate();

  const [clients, setClients]         = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [customClientName, setCustomClientName] = useState('');
  const [planType, setPlanType]       = useState(1);
  const [lumpSum, setLumpSum]         = useState('');
  const [monthly, setMonthly]         = useState('');

  const [projections, setProjections] = useState(null);
  const [chartData, setChartData]     = useState([]);
  const [errorMsg, setErrorMsg]       = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    api.get('/clients').then(r => setClients(r.data || [])).catch(() => {});
  }, []);

  const handleCalculate = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setProjections(null);

    const clientName = selectedClient || customClientName;
    if (!clientName) { setErrorMsg('Please select or enter a client name.'); return; }

    const lump    = parseFloat(lumpSum)  || 0;
    const mon     = parseFloat(monthly)  || 0;

    if (lump === 0 && mon === 0) { setErrorMsg('Both lump sum and monthly contribution cannot be zero.'); return; }

    const err = validateInputs(lump, mon, planType);
    if (err) { setErrorMsg(err); return; }

    const results = [1, 5, 10].map(years => ({
      years,
      min: runCompounding(lump, mon, planType, years, 'min'),
      max: runCompounding(lump, mon, planType, years, 'max')
    }));

    setProjections(results);
    setChartData(results.map(r => ({
      name: `${r.years} Yr`,
      'Invested':     Math.round(r.min.invested),
      'Min Forecast': Math.round(r.min.value),
      'Max Forecast': Math.round(r.max.value)
    })));
  };

  const handleSave = async () => {
    if (!projections || saving) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    const clientName = selectedClient || customClientName;
    try {
      await api.post('/quotes', {
        clientName,
        planType,
        lumpSum:             parseFloat(lumpSum)  || 0,
        monthlyContribution: parseFloat(monthly)  || 0
      });
      setSuccessMsg('Investment quote saved successfully to the client ledger!');
      setLumpSum(''); setMonthly(''); setSelectedClient(''); setCustomClientName('');
      setProjections(null);
      setTimeout(() => navigate('/history'), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save quote.');
    } finally {
      setSaving(false);
    }
  };

  const cfg = PLANS_CONFIG[planType];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Investment <span className="text-gradient-brand">Planner</span></h2>
        <p className="text-textSecondary mt-1.5 text-sm">Generate personalised multi-year compound growth quotes for clients.</p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 p-4 bg-coralAccent/10 border border-coralAccent/20 text-coralAccent text-sm rounded-xl animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-medium text-xs">{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-secondaryAccent/10 border border-secondaryAccent/20 text-secondaryAccent text-sm rounded-xl animate-scale-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{successMsg}</p>
        </div>
      )}

      {/* ── 1. Plan Selector ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primaryAccent" />
          1. Select Investment Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-in">
          {[1, 2, 3].map(num => {
            const p = PLANS_CONFIG[num];
            const active = planType === num;

            const planThemes = {
              1: { color: '#8B63FF', bg: 'rgba(111,59,253,0.08)',  border: 'rgba(111,59,253,0.3)',  shadow: '0 0 24px rgba(111,59,253,0.12)', badgeClass: 'badge-purple', label: 'Conservative' },
              2: { color: '#07E0B0', bg: 'rgba(7,224,176,0.08)',   border: 'rgba(7,224,176,0.3)',   shadow: '0 0 24px rgba(7,224,176,0.1)',   badgeClass: 'badge-teal',   label: 'Balanced'     },
              3: { color: '#FFC228', bg: 'rgba(255,194,40,0.08)',  border: 'rgba(255,194,40,0.3)',  shadow: '0 0 24px rgba(255,194,40,0.1)', badgeClass: 'badge-gold',   label: 'High Growth'  },
            };
            const t = planThemes[num];

            return (
              <div
                key={num}
                onClick={() => { setPlanType(num); setErrorMsg(''); setProjections(null); }}
                className="card-interactive rounded-2xl p-6 cursor-pointer transition-all duration-300"
                style={{
                  background: active ? t.bg : 'rgba(17,27,46,0.6)',
                  borderColor: active ? t.border : 'rgba(26,39,64,0.7)',
                  boxShadow: active ? t.shadow : 'none',
                  transform: active ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${active ? t.badgeClass : 'text-textMuted'}`}
                    style={!active ? { background: 'rgba(26,39,64,0.6)', border: '1px solid rgba(26,39,64,0.8)' } : {}}>
                    Option {num}
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`badge ${t.badgeClass}`} style={{ opacity: active ? 1 : 0.55 }}>
                      {t.label}
                    </span>
                  </div>
                </div>

                {/* Icon accent */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: t.color }} />
                </div>

                <h4 className="font-bold text-base mb-2 transition-colors" style={{ color: active ? t.color : '#F1F5F9' }}>{p.name}</h4>
                <p className="text-[11px] text-textSecondary leading-relaxed mb-5">{p.desc}</p>

                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t text-[11px]"
                  style={{ borderColor: active ? `${t.color}25` : 'rgba(26,39,64,0.5)' }}>
                  <div>
                    <span className="text-textMuted block mb-0.5">Annual Return</span>
                    <span className="font-extrabold" style={{ color: active ? t.color : '#F1F5F9' }}>{p.minRate}% – {p.maxRate}%</span>
                  </div>
                  <div>
                    <span className="text-textMuted block mb-0.5">Monthly Fee</span>
                    <span className="font-extrabold text-textPrimary">{p.monthlyFeeRate}%</span>
                  </div>
                  <div>
                    <span className="text-textMuted block mb-0.5">Min Monthly</span>
                    <span className="font-extrabold text-textPrimary">{p.minMonthly.toLocaleString()} AED</span>
                  </div>
                  <div>
                    <span className="text-textMuted block mb-0.5">Tax</span>
                    <span className="font-extrabold text-textPrimary">{p.taxDesc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active plan rule summary banner */}
      <div className="flex items-start gap-3 p-4 bg-primaryAccent/10 border border-primaryAccent/20 rounded-xl text-xs text-textSecondary fade-in">
        <Info className="w-4 h-4 text-primaryAccent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-textPrimary">{cfg.name} — Eligibility Rules: </span>
          {cfg.minLumpSum > 0 && <span>  Min lump sum: <b className="text-textPrimary">{cfg.minLumpSum.toLocaleString()} AED</b>.</span>}
          <span>  Min monthly: <b className="text-textPrimary">{cfg.minMonthly.toLocaleString()} AED</b>.</span>
          {cfg.maxPerYear !== Infinity && <span>  Max annual investment: <b className="text-textPrimary">{cfg.maxPerYear.toLocaleString()} AED</b>.</span>}
          <span>  Tax: <b className="text-textPrimary">{cfg.taxDesc}</b>.</span>
        </div>
      </div>

      {/* ── 2. Parameters Form ───────────────────────────────────────────── */}
      <div className="card-interactive bg-cardBg rounded-2xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-5 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primaryAccent" />
          2. Client & Investment Parameters
        </h3>
        <form onSubmit={handleCalculate} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Select Existing Client</label>
              <select
                value={selectedClient}
                onChange={e => { setSelectedClient(e.target.value); if (e.target.value) setCustomClientName(''); }}
                className="input-field w-full"
              >
                <option value="">— Choose a client —</option>
                {clients.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Or Enter Client Name</label>
              <input
                type="text"
                placeholder="Client full name"
                value={customClientName}
                onChange={e => { setCustomClientName(e.target.value); if (e.target.value) setSelectedClient(''); }}
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">
                Initial Lump Sum (AED)
                {cfg.minLumpSum > 0 && <span className="ml-2 badge badge-coral font-medium lowercase">min {cfg.minLumpSum.toLocaleString()}</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-textMuted text-xs font-bold">AED</span>
                <input
                  type="number" min="0" step="any"
                  placeholder={cfg.minLumpSum > 0 ? String(cfg.minLumpSum) : '0'}
                  value={lumpSum}
                  onChange={e => setLumpSum(e.target.value)}
                  className="input-field w-full pl-14"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">
                Monthly Contribution (AED)
                <span className="ml-2 badge badge-coral font-medium lowercase">min {cfg.minMonthly.toLocaleString()}</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-textMuted text-xs font-bold">AED</span>
                <input
                  type="number" min="0" step="any"
                  placeholder={String(cfg.minMonthly)}
                  value={monthly}
                  onChange={e => setMonthly(e.target.value)}
                  className="input-field w-full pl-14"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Generate Growth Projections
          </button>
        </form>
      </div>

      {/* ── 3. Projection Results ─────────────────────────────────────────── */}
      {projections && (
        <div className="space-y-8 fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-goldAccent" />
            3. Personalised Investment Quote
          </h3>

          {/* Year Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-in">
            {projections.map(p => (
              <div key={p.years} className="bg-surfaceBg border border-borderColor/40 hover:border-primaryAccent/30 transition-colors rounded-xl p-6 space-y-5">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-borderColor/40 pb-3">
                  <span className="font-extrabold text-textPrimary">{p.years} Year{p.years > 1 ? 's' : ''}</span>
                  <span className="text-[10px] text-textMuted bg-darkBg px-2 py-1 rounded-md">Invested: {fmt(p.min.invested)}</span>
                </div>

                {/* Minimum scenario */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-textMuted mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primaryAccent"></span>
                    Minimum Return ({PLANS_CONFIG[planType].minRate}% p.a.)
                  </p>
                  <p className="text-xl font-black text-textPrimary">{fmt(p.min.value)} AED</p>
                  <div className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-primaryAccent/30 text-[11px]">
                    <div className="flex justify-between"><span className="text-textMuted">Gross Profit</span><span className="text-secondaryAccent font-semibold">+{fmt(p.min.profit)}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Fees Paid</span><span className="text-coralAccent">−{fmt(p.min.fees)}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Tax</span><span className="text-goldAccent">−{fmt(p.min.tax)}</span></div>
                  </div>
                </div>

                {/* Maximum scenario */}
                <div className="pt-4 border-t border-borderColor/40">
                  <p className="text-[10px] font-bold uppercase text-textMuted mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondaryAccent"></span>
                    Maximum Return ({PLANS_CONFIG[planType].maxRate}% p.a.)
                  </p>
                  <p className="text-xl font-black text-secondaryAccent">{fmt(p.max.value)} AED</p>
                  <div className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-secondaryAccent/30 text-[11px]">
                    <div className="flex justify-between"><span className="text-textMuted">Gross Profit</span><span className="text-secondaryAccent font-semibold">+{fmt(p.max.profit)}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Fees Paid</span><span className="text-coralAccent">−{fmt(p.max.fees)}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Tax</span><span className="text-goldAccent">−{fmt(p.max.tax)}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Save */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar chart */}
            <div className="card-interactive bg-cardBg rounded-2xl p-6 lg:col-span-2">
              <h4 className="font-bold text-textPrimary text-base mb-6">Portfolio Growth Comparison (AED)</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A2740" opacity={0.4} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={v => `${Number(v).toLocaleString()} AED`}
                      contentStyle={{ backgroundColor: '#0D1525', borderColor: '#1A2740', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                    <Bar name="Invested Capital"   dataKey="Invested"     fill="#64748B" radius={[6,6,0,0]} />
                    <Bar name="Min Forecast Value" dataKey="Min Forecast" fill="#6F3BFD" radius={[6,6,0,0]} />
                    <Bar name="Max Forecast Value" dataKey="Max Forecast" fill="#07E0B0" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quote summary & save */}
            <div className="card-interactive bg-cardBg rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-4 h-4 text-goldAccent" />
                  <h4 className="font-bold text-textPrimary text-base">Quote Summary</h4>
                </div>
                <div className="space-y-3.5 text-xs">
                  {[
                    ['Client',        selectedClient || customClientName],
                    ['Plan',          `${planType} – ${PLANS_CONFIG[planType].name}`],
                    ['Lump Sum',      `${fmt(parseFloat(lumpSum)||0)} AED`],
                    ['Monthly',       `${fmt(parseFloat(monthly)||0)} AED`],
                    ['Annual Yield',  `${PLANS_CONFIG[planType].minRate}% – ${PLANS_CONFIG[planType].maxRate}%`],
                    ['Monthly Fee',   `${PLANS_CONFIG[planType].monthlyFeeRate}%`],
                    ['Tax Structure', PLANS_CONFIG[planType].taxDesc],
                    ['10-Yr Max',     `${fmt(projections[2].max.value)} AED`]
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-2 border-b border-borderColor/30 pb-2">
                      <span className="text-textMuted font-medium">{label}</span>
                      <span className="font-bold text-textPrimary text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-success w-full mt-8 py-3.5 text-sm flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving Quote...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save Quote to Ledger
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
