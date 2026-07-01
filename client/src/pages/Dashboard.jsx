import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Users,
  RefreshCw,
  TrendingUp,
  Coins,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Activity,
  Sparkles,
  Calendar,
  Zap,
  TrendingDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Advisor';

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [ratesData, setRatesData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryRes, ratesRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/rates')
        ]);
        setDashboardData(summaryRes.data);
        setRatesData(ratesRes.data);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Failed to fetch real-time analytics from Express server.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-cardBg rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 bg-cardBg border border-borderColor rounded-2xl shimmer"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-cardBg border border-borderColor rounded-2xl shimmer"></div>
          <div className="h-[400px] bg-cardBg border border-borderColor rounded-2xl shimmer"></div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { clients: 0, conversions: 0, quotes: 0, volume: 0 };
  const recentActivity = dashboardData?.recentActivity || [];
  const chartData = dashboardData?.chartData || [];

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const currenciesToDisplay = ['USD', 'EUR', 'GBP', 'BRL', 'JPY'];
  const rates = ratesData?.rates || {};

  // Custom colors matching the landing page theme colors
  const statCards = [
    {
      label: 'Active Clients',
      value: stats.clients,
      icon: Users,
      color: '#8B63FF',
      shadow: '0 0 24px rgba(111,59,253,0.12)',
      bg: 'rgba(111,59,253,0.08)',
      border: 'rgba(111,59,253,0.2)',
      badgeClass: 'badge-purple',
      sub: 'Live managed accounts',
    },
    {
      label: 'Conversions Logged',
      value: stats.conversions,
      icon: RefreshCw,
      color: '#07E0B0',
      shadow: '0 0 24px rgba(7,224,176,0.1)',
      bg: 'rgba(7,224,176,0.08)',
      border: 'rgba(7,224,176,0.2)',
      badgeClass: 'badge-teal',
      sub: 'Subject to tiered fees',
    },
    {
      label: 'Investment Quotes',
      value: stats.quotes,
      icon: TrendingUp,
      color: '#FFC228',
      shadow: '0 0 24px rgba(255,194,40,0.1)',
      bg: 'rgba(255,194,40,0.08)',
      border: 'rgba(255,194,40,0.2)',
      badgeClass: 'badge-gold',
      sub: 'Compound simulations',
    },
    {
      label: 'Converted Volume',
      value: formatCurrency(stats.volume),
      icon: Coins,
      color: '#FB315D',
      shadow: '0 0 24px rgba(251,49,93,0.1)',
      bg: 'rgba(251,49,93,0.08)',
      border: 'rgba(251,49,93,0.2)',
      badgeClass: 'badge-coral',
      sub: 'Excluding fee deductions',
      small: true,
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Background ambient orbs */}
      <div className="absolute top-[-100px] left-1/4 w-[400px] h-[300px] bg-primaryAccent/[0.04] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[250px] bg-secondaryAccent/[0.03] blur-[80px] rounded-full pointer-events-none" />

      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Marhaban, <span className="text-gradient-brand">{firstName}</span>
          </h2>
          <p className="text-textSecondary mt-1.5 text-sm">
            Here is EFCG's portfolio performance and system cache analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surfaceBg/60 border border-borderColor/40 text-xs font-semibold text-textMuted">
          <Calendar className="w-3.5 h-3.5 text-primaryAccent" />
          <span>Advisor Dashboard Overview</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-coralAccent/10 border border-coralAccent/20 text-coralAccent text-sm rounded-xl animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{error}</p>
        </div>
      )}

      {/* 4 Overview Stat Cards with LandingPage style hover overrides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 stagger-in">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="card-interactive bg-cardBg rounded-2xl p-5 group cursor-default transition-all duration-400 relative overflow-hidden"
              style={{ border: `1px solid ${card.border}`, background: 'rgba(13,21,37,0.7)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${card.color}50`;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = card.shadow;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = card.border;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Corner Glow Overlay */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${card.color}12, transparent 70%)` }} />

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">{card.label}</p>
                  <h3 className={`${card.small ? 'text-lg sm:text-base md:text-sm lg:text-lg' : 'text-2xl'} font-extrabold mt-1.5 text-textPrimary truncate`}>
                    {card.value}
                  </h3>
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-400 group-hover:scale-110"
                  style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-borderColor/45 flex items-center gap-2 text-[11px] text-textMuted">
                <span className={`badge ${card.badgeClass}`}>Active</span>
                <span className="truncate">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Activity Volume Bar Chart */}
        <div className="card-interactive bg-cardBg rounded-2xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-textPrimary text-base">Monthly Activity Volume</h4>
              <p className="text-xs text-textMuted mt-0.5">Transactional metrics tracked for the past 6 months</p>
            </div>
            <span className="badge badge-purple">Analytics</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2740" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D1525', borderColor: '#1A2740', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', fontSize: '11px' }}
                  labelStyle={{ color: '#F1F5F9', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar name="Currency Conversions" dataKey="conversions" fill="#6F3BFD" radius={[6, 6, 0, 0]} />
                <Bar name="Investment Quotes" dataKey="quotes" fill="#07E0B0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card-interactive bg-cardBg rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-primaryAccent/10 border border-primaryAccent/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-primaryAccent animate-glow" />
              </div>
              <div>
                <h4 className="font-bold text-textPrimary text-base">Recent Activity</h4>
                <p className="text-[10px] text-textMuted">Latest advisory operations</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
              {recentActivity.length === 0 ? (
                <div className="text-center py-12 text-textMuted text-xs">
                  No portfolio activity recorded yet.
                </div>
              ) : (
                recentActivity.map((act) => (
                  <div key={act.id} className="p-3.5 bg-surfaceBg/60 rounded-xl border border-borderColor/45 hover:border-primaryAccent/30 hover:bg-surfaceBg/80 transition-all duration-300 group">
                    <div className="flex justify-between items-center">
                      <span className={`badge ${act.type === 'conversion' ? 'badge-purple' : 'badge-teal'}`}>
                        {act.type}
                      </span>
                      <span className="text-[10px] text-textMuted">
                        {new Date(act.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-textPrimary mt-2 group-hover:text-primaryAccent transition-colors">{act.clientName}</p>
                    <p className="text-[11px] text-textSecondary mt-0.5 leading-relaxed">{act.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Exchange Rates Benchmark Grid */}
      <div className="card-interactive bg-cardBg rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondaryAccent/10 border border-secondaryAccent/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-secondaryAccent animate-glow" />
            </div>
            <div>
              <h4 className="font-bold text-textPrimary text-base">AED Conversion Benchmark</h4>
              <p className="text-xs text-textMuted mt-0.5">
                Feed: <span className="text-secondaryAccent font-semibold">{ratesData?.source === 'live' ? 'Frankfurter API' : 'Cached Recovery'}</span>
                {ratesData?.warning && <span className="text-goldAccent block mt-1">⚠️ {ratesData.warning}</span>}
              </p>
            </div>
          </div>
          <span className="badge badge-teal">
            <span className="w-1.5 h-1.5 rounded-full bg-secondaryAccent animate-pulse mr-1"></span>
            {ratesData?.fetchedAt ? new Date(ratesData.fetchedAt).toLocaleTimeString() : 'N/A'}
          </span>
        </div>

        {/* Currency display items using individual theme properties */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 stagger-in">
          {currenciesToDisplay.map((cur, idx) => {
            const val = rates[cur];
            const themeColors = ['#8B63FF', '#07E0B0', '#FFC228', '#FB315D', '#8B63FF'];
            const activeColor = themeColors[idx % themeColors.length];
            return (
              <div
                key={cur}
                className="group bg-surfaceBg/60 border border-borderColor/40 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-default"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${activeColor}40`;
                  e.currentTarget.style.boxShadow = `0 10px 24px ${activeColor}12`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(26,39,64,0.4)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">{cur}</span>
                <span className="text-xl font-black text-textPrimary mt-1.5 group-hover:scale-105 transition-all" style={{ color: activeColor }}>
                  {val ? val.toFixed(4) : '—'}
                </span>
                <span className="text-[9px] text-textMuted mt-1">per 1 AED</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
