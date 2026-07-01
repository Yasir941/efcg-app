import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye, EyeOff, Lock, Mail, AlertCircle,
  User as UserIcon, ArrowRight, Sparkles, ShieldCheck
} from 'lucide-react';
import Logo from '../components/Logo';

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-darkBg text-textPrimary flex items-center justify-center p-4 relative overflow-hidden">

      {/* Ambient glow orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primaryAccent/[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondaryAccent/[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-coralAccent/[0.03] blur-[80px] rounded-full pointer-events-none" />

      {/* Floating decorative grid dots */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(#6F3BFD 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Card */}
      <div className="w-full max-w-[420px] glass rounded-3xl shadow-2xl relative z-10 fade-in overflow-hidden">

        {/* Colored top stripe */}
        <div className={`h-1 w-full transition-all duration-700 ${isLogin ? 'bg-gradient-to-r from-primaryAccent via-coralAccent to-goldAccent' : 'bg-gradient-to-r from-secondaryAccent via-primaryAccent to-coralAccent'}`} />

        <div className="p-8">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-5 animate-float">
              <Logo width="52" height="48" />
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight transition-all duration-500 ${isLogin ? 'text-gradient-brand' : 'text-gradient-gold'}`}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-textMuted mt-1.5 text-center">
              {isLogin ? 'Sign in to your EFCG advisor portal' : 'Register for a new advisor account'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-coralAccent/10 border border-coralAccent/25 text-coralAccent rounded-xl mb-6 animate-scale-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name Field — signup only */}
            {!isLogin && (
              <div className="fade-in">
                <label className="block text-xs font-bold uppercase tracking-wider text-secondaryAccent/80 mb-2">
                  Full Name <span className="text-coralAccent">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryAccent/60 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field input-field-teal w-full"
                    style={{ paddingLeft: '2.75rem' }}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primaryAccent/80 mb-2">
                Email Address <span className="text-coralAccent">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primaryAccent/60 pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="advisor@efcg.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                  style={{ paddingLeft: '2.75rem' }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password — FIXED: icon doesn't overlap text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-goldAccent/80 mb-2">
                Password <span className="text-coralAccent">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-goldAccent/60 pointer-events-none z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full"
                  style={{ paddingLeft: '2.75rem', paddingRight: '3.25rem' }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-lg text-textMuted hover:text-goldAccent transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 ${isLogin ? 'btn-primary' : 'btn-success'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Authenticating...' : 'Creating Account...'}
                </span>
              ) : (
                <>
                  {isLogin ? 'Sign In to Portal' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-textMuted hover:text-textPrimary transition-colors font-medium group"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className={`font-bold transition-colors ${isLogin ? 'text-secondaryAccent group-hover:text-secondaryAccent/80' : 'text-primaryAccent group-hover:text-primaryAccent/80'}`}>
                {isLogin ? 'Sign Up Free' : 'Sign In'}
              </span>
            </button>
          </div>

          {/* Demo credentials */}
          {isLogin && (
            <div className="mt-6 pt-5 border-t border-borderColor/30">
              <div className="flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-goldAccent animate-glow" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Demo Credentials</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-surfaceBg border border-borderColor/40 rounded-xl hover:border-primaryAccent/20 transition-colors group cursor-pointer"
                  onClick={() => { setEmail('advisor@efcg.ae'); setPassword('advisor123'); }}>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-purple">Advisor</span>
                    <span className="text-[11px] text-textSecondary">advisor@efcg.ae</span>
                  </div>
                  <span className="text-[10px] text-textMuted group-hover:text-primaryAccent transition-colors">Click to fill</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surfaceBg border border-borderColor/40 rounded-xl hover:border-goldAccent/20 transition-colors group cursor-pointer"
                  onClick={() => { setEmail('admin@efcg.ae'); setPassword('admin123'); }}>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-gold">Admin</span>
                    <span className="text-[11px] text-textSecondary">admin@efcg.ae</span>
                  </div>
                  <span className="text-[10px] text-textMuted group-hover:text-goldAccent transition-colors">Click to fill</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
