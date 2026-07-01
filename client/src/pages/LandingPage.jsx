import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Server,
  ArrowRight,
  LineChart,
  Zap,
  Globe,
  Lock,
  BarChart3,
  RefreshCw,
  Users,
  CheckCircle,
  Star,
  Sparkles,
  Building2,
  Award
} from 'lucide-react';
import Logo from '../components/Logo';

/* ── tiny hook: counts up a number on mount ─────────────────────────── */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── rotating words in hero ─────────────────────────────────────────── */
const ROTATING_WORDS = ['Excellence', 'Security', 'Growth', 'Innovation', 'Trust'];

export default function LandingPage() {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Coins,
      title: 'Tiered Currency Conversion',
      desc: 'Execute cross-border exchange calculations with dynamically updated live rates. Progressive fee reductions reward higher transaction volumes automatically.',
      accentColor: '#6F3BFD',
      badge: 'badge-purple',
      badgeText: 'FX Engine',
      bg: 'rgba(111,59,253,0.07)',
      border: 'rgba(111,59,253,0.15)',
      hoverBorder: '#6F3BFD',
      glow: 'rgba(111,59,253,0.15)',
    },
    {
      icon: TrendingUp,
      title: 'Multi-Year Growth Planner',
      desc: 'Run compound interest simulations across 1, 5, and 10-year horizons with plan-specific fee structures and progressive UAE tax thresholds.',
      accentColor: '#07E0B0',
      badge: 'badge-teal',
      badgeText: 'Projections',
      bg: 'rgba(7,224,176,0.07)',
      border: 'rgba(7,224,176,0.15)',
      hoverBorder: '#07E0B0',
      glow: 'rgba(7,224,176,0.12)',
    },
    {
      icon: ShieldCheck,
      title: 'Advisor-Led Security & Audit',
      desc: 'Comprehensive activity audits capture advisor and administrator workflows. Role-based routes preserve compliance records end-to-end.',
      accentColor: '#FFC228',
      badge: 'badge-gold',
      badgeText: 'Compliance',
      bg: 'rgba(255,194,40,0.07)',
      border: 'rgba(255,194,40,0.15)',
      hoverBorder: '#FFC228',
      glow: 'rgba(255,194,40,0.12)',
    },
    {
      icon: Server,
      title: 'High-Availability Rate Caching',
      desc: 'Dual-cache architecture with external API 3x retry routines. Failed endpoints trigger DB logging and cache failovers automatically.',
      accentColor: '#FB315D',
      badge: 'badge-coral',
      badgeText: 'Infrastructure',
      bg: 'rgba(251,49,93,0.07)',
      border: 'rgba(251,49,93,0.15)',
      hoverBorder: '#FB315D',
      glow: 'rgba(251,49,93,0.12)',
    },
  ];

  const stats = [
    { value: 6,       suffix: ' FX',    label: 'Live Currency Pairs',    color: '#8B63FF', icon: RefreshCw  },
    { value: 3,       suffix: ' Plans', label: 'Compound Growth Plans',  color: '#07E0B0', icon: TrendingUp  },
    { value: 99,      suffix: '.9%',    label: 'Platform Uptime SLA',    color: '#FFC228', icon: Server      },
    { value: 50000,   suffix: ' AED',   label: 'Max Transaction Limit',  color: '#FB315D', icon: Coins       },
  ];

  const services = [
    { icon: Coins,      title: 'Currency Exchange',    desc: 'Multi-currency conversion with live rates',    color: '#8B63FF' },
    { icon: TrendingUp, title: 'Investment Planning',  desc: 'Compound growth projections & tax forecasts', color: '#07E0B0' },
    { icon: Users,      title: 'Client Management',    desc: 'Full client profile & consent management',     color: '#FFC228' },
    { icon: BarChart3,  title: 'Portfolio Analytics',  desc: 'Real-time portfolio performance tracking',    color: '#FB315D' },
    { icon: ShieldCheck,title: 'Compliance Audit',     desc: 'UAE DFSA-compliant audit trail system',       color: '#8B63FF' },
    { icon: Globe,      title: 'Global Access',        desc: 'Secure access from anywhere worldwide',       color: '#07E0B0' },
  ];

  const testimonials = [
    { quote: 'EFCG transformed how we manage high-net-worth client portfolios. The live rate engine is exceptional.', name: 'Mohammed Al-Rashid', role: 'Senior Wealth Advisor', rating: 5, color: '#6F3BFD' },
    { quote: 'The investment projection tools are incredibly accurate and client-ready. Saves hours every week.', name: 'Sarah Thompson', role: 'Financial Consultant', rating: 5, color: '#07E0B0' },
    { quote: 'Audit trails and compliance built-in. This is exactly what the UAE market needed.', name: 'Ahmed Hassan', role: 'Regional Director', rating: 5, color: '#FFC228' },
  ];

  return (
    <div className="min-h-screen bg-darkBg text-textPrimary flex flex-col overflow-x-hidden">

      {/* ════════════════════════════ NAVBAR ════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-white/5"
        style={{ background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Logo width="40" height="36" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-gradient-brand">Emirates Finance</span>
              <span className="text-[9px] block text-textMuted font-bold uppercase tracking-[0.15em] -mt-0.5">Consulting Group</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {[['#features', 'Features'], ['#services', 'Services'], ['#testimonials', 'Reviews']].map(([href, label]) => (
              <a key={href} href={href}
                className="text-sm text-textMuted font-medium relative group transition-colors hover:text-textPrimary">
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-primaryAccent to-secondaryAccent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
          >
            Advisor Portal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* ════════════════════════════ HERO ════════════════════════════════ */}
      <section className="relative flex-1 overflow-hidden" style={{ minHeight: '90vh' }}>

        {/* ── layered animated background ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(111,59,253,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(111,59,253,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          {/* Big rotating gradient orbs */}
          <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full opacity-30 animate-float"
            style={{ background: 'radial-gradient(circle, rgba(111,59,253,0.35) 0%, transparent 70%)', animationDuration: '8s' }} />
          <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(7,224,176,0.3) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(251,49,93,0.25) 0%, transparent 70%)', animation: 'float 12s ease-in-out infinite 2s' }} />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,194,40,0.2) 0%, transparent 70%)', animation: 'float 9s ease-in-out infinite 1s' }} />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: `${3 + (i % 4)}px`,
                height: `${3 + (i % 4)}px`,
                left: `${8 + i * 8}%`,
                top: `${10 + (i * 17) % 80}%`,
                background: ['#6F3BFD', '#07E0B0', '#FFC228', '#FB315D'][i % 4],
                opacity: 0.4 + (i % 3) * 0.15,
                animation: `float ${5 + (i % 4)}s ease-in-out infinite ${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* ── Hero content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-36 flex flex-col items-center text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8 border fade-in"
            style={{ background: 'rgba(111,59,253,0.1)', borderColor: 'rgba(111,59,253,0.25)', backdropFilter: 'blur(10px)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#07E0B0' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#07E0B0' }} />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#07E0B0' }}>
              UAE DFSA Regulatory Compliant Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-5xl leading-[1.05] fade-in" style={{ animationDelay: '100ms' }}>
            <span className="text-textPrimary">Financial </span>
            <span
              className="inline-block transition-all duration-400"
              style={{
                background: 'linear-gradient(135deg, #6F3BFD, #FB315D, #FFC228)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? 'translateY(0)' : 'translateY(-12px)',
              }}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
            <br />
            <span className="text-textPrimary">for the </span>
            <span style={{
              background: 'linear-gradient(135deg, #07E0B0, #6F3BFD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Modern Emirates
            </span>
          </h1>

          <p className="text-base md:text-xl text-textSecondary mt-8 max-w-2xl leading-relaxed fade-in" style={{ animationDelay: '200ms' }}>
            EFCG provides high-net-worth individuals, institutional clients, and advisors with
            <span style={{ color: '#8B63FF' }}> secure multi-currency tools</span>,
            <span style={{ color: '#07E0B0' }}> automated growth projections</span>, and
            <span style={{ color: '#FFC228' }}> full compliance audit trails</span>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '300ms' }}>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary px-10 py-4 text-base flex items-center gap-3 justify-center group"
            >
              <Zap className="w-5 h-5" />
              Launch Advisor Portal
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#features"
              className="px-10 py-4 rounded-xl font-semibold text-base text-textPrimary transition-all duration-300 text-center flex items-center gap-2 justify-center group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(111,59,253,0.4)'; e.currentTarget.style.background = 'rgba(111,59,253,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <LineChart className="w-5 h-5 text-secondaryAccent" />
              Explore Features
            </a>
          </div>

          {/* Trust badges row */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 fade-in" style={{ animationDelay: '400ms' }}>
            {[
              { icon: ShieldCheck, text: 'DFSA Regulated', color: '#07E0B0' },
              { icon: Lock, text: 'Bank-Grade Security', color: '#8B63FF' },
              { icon: Globe, text: 'UAE Based', color: '#FFC228' },
              { icon: Award, text: 'ISO Certified', color: '#FB315D' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${color}12`; e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = 'scale(1)'; }}>
                <Icon className="w-3.5 h-3.5" />
                {text}
              </div>
            ))}
          </div>

          {/* ── Stats Bar ── */}
          <div className="w-full mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 fade-in" style={{ animationDelay: '500ms' }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i}
                  className="relative rounded-2xl p-6 text-center cursor-default transition-all duration-400 group overflow-hidden"
                  style={{ background: 'rgba(13,21,37,0.7)', border: `1px solid rgba(255,255,255,0.06)`, backdropFilter: 'blur(12px)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${stat.color}40`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${stat.color}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color}08, transparent 70%)` }} />
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl md:text-3xl font-extrabold" style={{ color: stat.color }}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-[11px] font-semibold text-textMuted mt-1.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ FEATURES ═══════════════════════════ */}
      <section id="features" className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #070B14 0%, #0D1525 50%, #070B14 100%)' }}>

        {/* bg accent */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(111,59,253,0.4) 0%, transparent 70%)' }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(7,224,176,0.3) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: 'rgba(111,59,253,0.1)', border: '1px solid rgba(111,59,253,0.2)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primaryAccent" />
              <span className="text-xs font-bold uppercase tracking-wider text-primaryAccent">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Engineered for{' '}
              <span style={{ background: 'linear-gradient(135deg, #6F3BFD, #07E0B0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                High-Performance
              </span>{' '}Finance
            </h2>
            <p className="text-textSecondary mt-4 leading-relaxed text-base">
              Empowering institutional wealth advisors with modern calculation engines and full audit logging.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i}
                  className="relative rounded-2xl p-8 cursor-default group overflow-hidden transition-all duration-400"
                  style={{ background: feat.bg, border: `1px solid ${feat.border}`, animationDelay: `${i * 80}ms` }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${feat.hoverBorder}50`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 16px 48px ${feat.glow}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = feat.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `linear-gradient(90deg, transparent, ${feat.accentColor}, transparent)` }} />

                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${feat.accentColor}15, transparent 70%)` }} />

                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: `${feat.accentColor}15`, border: `1px solid ${feat.accentColor}25` }}>
                      <Icon className="w-7 h-7" style={{ color: feat.accentColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`badge ${feat.badge}`}>{feat.badgeText}</span>
                      </div>
                      <h3 className="text-xl font-bold text-textPrimary mb-2 group-hover:text-white transition-colors">{feat.title}</h3>
                      <p className="text-textSecondary text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t opacity-0 group-hover:opacity-100 transition-all duration-400"
                    style={{ borderColor: `${feat.accentColor}20` }}>
                    <CheckCircle className="w-4 h-4" style={{ color: feat.accentColor }} />
                    <span className="text-xs font-semibold" style={{ color: feat.accentColor }}>Enterprise Ready</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" style={{ color: feat.accentColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ SERVICES ═══════════════════════════ */}
      <section id="services" className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0D1525 0%, #070B14 100%)' }}>

        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#07E0B0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: 'rgba(7,224,176,0.1)', border: '1px solid rgba(7,224,176,0.2)' }}>
              <Building2 className="w-3.5 h-3.5 text-secondaryAccent" />
              <span className="text-xs font-bold uppercase tracking-wider text-secondaryAccent">Our Services</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Complete Financial{' '}
              <span style={{ background: 'linear-gradient(135deg, #07E0B0, #FFC228)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Solutions
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i}
                  className="rounded-2xl p-6 group cursor-default transition-all duration-400 relative overflow-hidden"
                  style={{ background: 'rgba(13,21,37,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${svc.color}40`;
                    e.currentTarget.style.background = `${svc.color}08`;
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                    e.currentTarget.style.boxShadow = `0 20px 50px ${svc.color}15`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.background = 'rgba(13,21,37,0.8)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top left, ${svc.color}10, transparent 60%)` }} />

                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-400 group-hover:scale-110"
                    style={{ background: `${svc.color}12`, border: `1px solid ${svc.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: svc.color }} />
                  </div>
                  <h3 className="font-bold text-textPrimary mb-1.5 text-base group-hover:text-white transition-colors">{svc.title}</h3>
                  <p className="text-sm text-textSecondary leading-relaxed">{svc.desc}</p>

                  <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: svc.color }}>
                    <span className="text-xs font-bold">Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section id="testimonials" className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #070B14 0%, #0D1525 100%)' }}>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(111,59,253,0.5) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: 'rgba(255,194,40,0.1)', border: '1px solid rgba(255,194,40,0.2)' }}>
              <Star className="w-3.5 h-3.5 text-goldAccent fill-goldAccent" />
              <span className="text-xs font-bold uppercase tracking-wider text-goldAccent">Client Reviews</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Trusted by UAE's{' '}
              <span style={{ background: 'linear-gradient(135deg, #FFC228, #FB315D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Top Advisors
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i}
                className="rounded-2xl p-7 group cursor-default transition-all duration-400 relative overflow-hidden"
                style={{ background: 'rgba(13,21,37,0.8)', border: `1px solid ${t.color}20` }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${t.color}50`;
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 20px 50px ${t.color}12`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${t.color}20`;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top colored stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${t.color}, transparent)` }} />

                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-goldAccent text-goldAccent" />
                  ))}
                </div>
                <p className="text-sm text-textSecondary leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold"
                    style={{ background: `${t.color}15`, border: `1px solid ${t.color}30`, color: t.color }}>
                    {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-textPrimary text-sm">{t.name}</p>
                    <p className="text-[11px] text-textMuted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ CTA BANNER ═════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Rainbow gradient bg */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(111,59,253,0.15) 0%, rgba(251,49,93,0.1) 40%, rgba(255,194,40,0.1) 70%, rgba(7,224,176,0.1) 100%)' }} />
        <div className="absolute inset-0 border-y"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center animate-float"
            style={{ background: 'linear-gradient(135deg, rgba(111,59,253,0.2), rgba(7,224,176,0.2))', border: '1px solid rgba(111,59,253,0.3)' }}>
            <Sparkles className="w-10 h-10" style={{ color: '#8B63FF' }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Elevate Your{' '}
            <span style={{ background: 'linear-gradient(135deg, #6F3BFD, #07E0B0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Advisory Practice?
            </span>
          </h2>
          <p className="text-textSecondary text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join EFCG's platform today and gain access to enterprise-grade financial tools trusted by UAE's leading advisors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary px-10 py-4 text-base flex items-center gap-3 justify-center group"
            >
              <Zap className="w-5 h-5" />
              Get Started Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ FOOTER ═════════════════════════════ */}
      <footer className="relative border-t overflow-hidden" style={{ background: '#07090F', borderColor: 'rgba(255,255,255,0.05)' }}>
        {/* Rainbow top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, #6F3BFD, #FB315D, #FFC228, #07E0B0, #6F3BFD)' }} />

        {/* bg glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(111,59,253,0.5) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <Logo width="36" height="33" />
                <div>
                  <span className="font-extrabold text-lg text-gradient-brand">Emirates Finance</span>
                  <span className="text-[9px] block text-textMuted font-bold uppercase tracking-[0.15em] -mt-0.5">Consulting Group</span>
                </div>
              </div>
              <p className="text-sm text-textSecondary leading-relaxed max-w-sm mb-6">
                EFCG provides professional financial advisory services including multi-currency conversions, savings & investment management, and portfolio consulting across the UAE.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'DFSA Regulated', icon: Lock, color: '#07E0B0', badge: 'badge-teal' },
                  { label: 'UAE Based', icon: Globe, color: '#8B63FF', badge: 'badge-purple' },
                  { label: 'ISO 27001', icon: ShieldCheck, color: '#FFC228', badge: 'badge-gold' },
                ].map(({ label, icon: Icon, color, badge }) => (
                  <span key={label} className={`badge ${badge} transition-all duration-200 cursor-default`}
                    style={{ paddingTop: '4px', paddingBottom: '4px' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Services column */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: '#8B63FF' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#8B63FF' }} />
                Services
              </h4>
              <ul className="space-y-3">
                {['Currency Conversion', 'Investment Planning', 'Portfolio Management', 'Tax Advisory', 'Compliance'].map(item => (
                  <li key={item} className="text-sm text-textSecondary cursor-pointer flex items-center gap-2 group transition-colors duration-200 hover:text-white">
                    <ChevronRightMini color="#8B63FF" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: '#07E0B0' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#07E0B0' }} />
                Legal
              </h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'UAE DFSA Regulations', 'Data Protection', 'Cookie Policy'].map(item => (
                  <li key={item} className="text-sm text-textSecondary cursor-pointer flex items-center gap-2 group transition-colors duration-200 hover:text-white">
                    <ChevronRightMini color="#07E0B0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-textMuted">
              © 2026 Emirates Finance Consulting Group. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-textMuted">
              {[
                { icon: ShieldCheck, text: 'Enterprise Security', color: '#07E0B0' },
                { icon: BarChart3,   text: 'Real-time Rates',    color: '#8B63FF'  },
                { icon: CheckCircle, text: 'UAE Compliant',      color: '#FFC228'  },
              ].map(({ icon: Icon, text, color }) => (
                <span key={text} className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default" style={{ color }}>
                  <Icon className="w-3.5 h-3.5" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* tiny helper — avoids importing another icon */
function ChevronRightMini({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3.5 2L6.5 5L3.5 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
