import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { History, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

const PLAN_NAMES = { 1: 'Basic Savings Plan', 2: 'Savings Plan Plus', 3: 'Managed Stock Investments' };

export default function TransactionHistory() {
  const [activeTab, setActiveTab] = useState('conversions');
  const [transactions, setTransactions] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [loadingQt, setLoadingQt] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [txRes, qtRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/quotes')
        ]);
        setTransactions(txRes.data || []);
        setQuotes(qtRes.data || []);
      } catch (err) {
        setError('Failed to load history records.');
      } finally {
        setLoadingTx(false);
        setLoadingQt(false);
      }
    }
    fetchData();
  }, []);

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const fmtNum = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Transaction <span className="text-gradient-brand">History</span></h2>
        <p className="text-textSecondary mt-1.5 text-sm">Complete ledger of all currency conversions and investment quotes.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-coralAccent/10 border border-coralAccent/20 text-coralAccent text-sm rounded-xl animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{error}</p>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-2 bg-surfaceBg border border-borderColor/40 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('conversions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            activeTab === 'conversions'
              ? 'bg-gradient-to-r from-primaryAccent to-primaryDark text-white shadow-glow'
              : 'text-textMuted hover:text-textPrimary hover:bg-darkBg/50'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Conversions ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            activeTab === 'quotes'
              ? 'bg-gradient-to-r from-secondaryAccent to-[#05B68E] text-white shadow-glow-teal'
              : 'text-textMuted hover:text-textPrimary hover:bg-darkBg/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Investment Quotes ({quotes.length})
        </button>
      </div>

      {/* Conversions Tab */}
      {activeTab === 'conversions' && (
        <div className="card-interactive bg-cardBg rounded-2xl overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borderColor/40 bg-surfaceBg/50">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Date</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Client</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">From</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Source Amount</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Advisory Fee</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">To</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Converted</th>
                  <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingTx ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-borderColor/20">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-borderColor/30 rounded shimmer"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-textMuted text-sm">
                      No currency conversions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-borderColor/30 hover:bg-surfaceBg/50 transition-colors">
                      <td className="px-6 py-4 text-textSecondary text-xs">{fmtDate(tx.createdAt)}</td>
                      <td className="px-6 py-4 font-semibold text-textPrimary">{tx.clientName}</td>
                      <td className="px-6 py-4">
                        <span className="badge badge-purple">{tx.fromCurrency}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-textPrimary">
                        {fmtNum(tx.sourceAmount)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-coralAccent">
                        -{fmtNum(tx.feeAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-teal">{tx.toCurrency}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-secondaryAccent">
                        {fmtNum(tx.convertedAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`badge ${
                          tx.status === 'completed'
                            ? 'badge-teal'
                            : 'badge-coral'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Investment Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="card-interactive bg-cardBg rounded-2xl overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borderColor/40 bg-surfaceBg/50">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Date</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Client</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Plan</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Lump Sum</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Monthly</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">10-Yr Max Projection</th>
                </tr>
              </thead>
              <tbody>
                {loadingQt ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-borderColor/20">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-borderColor/30 rounded shimmer"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : quotes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-textMuted text-sm">
                      No investment quotes created yet.
                    </td>
                  </tr>
                ) : (
                  quotes.map((q) => {
                    const tenYrMax = q.projections?.find(p => p.years === 10)?.max?.value;
                    return (
                      <tr key={q._id} className="border-b border-borderColor/30 hover:bg-surfaceBg/50 transition-colors">
                        <td className="px-6 py-4 text-textSecondary text-xs">{fmtDate(q.createdAt)}</td>
                        <td className="px-6 py-4 font-semibold text-textPrimary">{q.clientName}</td>
                        <td className="px-6 py-4">
                          <span className="badge badge-gold">
                            Plan {q.planType} — {PLAN_NAMES[q.planType]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-textPrimary">
                          {fmtNum(q.lumpSum)} AED
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-textPrimary">
                          {fmtNum(q.monthlyContribution)} AED
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-secondaryAccent">
                          {tenYrMax ? `${fmtNum(tenYrMax)} AED` : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
