import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutGrid,
  RefreshCw,
  TrendingUp,
  Users,
  History,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Calendar,
  Menu,
  X,
  ChevronRight,
  Zap
} from 'lucide-react';
import Logo from './Logo';

// Each nav item has its own color theme
const NAV_ITEMS = [
  { name: 'Dashboard',         path: '/dashboard', icon: LayoutGrid, theme: 'purple' },
  { name: 'Currency Transfer', path: '/convert',   icon: RefreshCw,  theme: 'teal'   },
  { name: 'Investment Planner',path: '/invest',    icon: TrendingUp, theme: 'gold'   },
  { name: 'Client Records',    path: '/clients',   icon: Users,      theme: 'coral'  },
  { name: 'History Logs',      path: '/history',   icon: History,    theme: 'purple' },
];

const ADMIN_ITEM = { name: 'System Admin', path: '/admin', icon: ShieldCheck, theme: 'teal' };

const THEME = {
  purple: {
    active:  'nav-active-purple',
    icon:    'text-[#8B63FF]',
    dot:     'bg-primaryAccent',
    hover:   'hover:text-[#8B63FF]',
    badge:   'badge-purple',
  },
  teal: {
    active:  'nav-active-teal',
    icon:    'text-secondaryAccent',
    dot:     'bg-secondaryAccent',
    hover:   'hover:text-secondaryAccent',
    badge:   'badge-teal',
  },
  gold: {
    active:  'nav-active-gold',
    icon:    'text-goldAccent',
    dot:     'bg-goldAccent',
    hover:   'hover:text-goldAccent',
    badge:   'badge-gold',
  },
  coral: {
    active:  'nav-active-coral',
    icon:    'text-coralAccent',
    dot:     'bg-coralAccent',
    hover:   'hover:text-coralAccent',
    badge:   'badge-coral',
  },
};

export default function AppShell({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  const SidebarContent = () => (
    <>
      <div>
        {/* Logo Brand */}
        <div className="h-[72px] flex items-center px-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Logo width="34" height="31" />
            <div>
              <span className="font-extrabold text-[15px] text-gradient-brand">EFCG</span>
              <span className="text-[9px] block text-textMuted -mt-0.5 font-bold uppercase tracking-[0.15em]">
                Consulting Group
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const t = THEME[item.theme];

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 relative overflow-hidden border ${
                  isActive
                    ? t.active
                    : `text-textMuted border-transparent hover:bg-surfaceBg/80 ${t.hover}`
                }`}
              >
                {/* Active left-bar accent */}
                {isActive && (
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full ${t.dot}`} />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-300 ${
                  isActive ? t.icon : `text-textMuted/70 group-hover:${t.icon} group-hover:scale-110`
                }`} />
                <span className="flex-1 font-semibold">{item.name}</span>
                {isActive && (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${t.icon}`} />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile + Sign Out */}
      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 mb-4 p-3 bg-surfaceBg/60 rounded-xl border border-white/5">
          <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border text-xs font-extrabold
            ${isAdmin
              ? 'bg-goldAccent/15 border-goldAccent/30 text-goldAccent'
              : 'bg-primaryAccent/15 border-primaryAccent/30 text-primaryAccent'
            }`}>
            {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-textPrimary truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-goldAccent' : 'bg-secondaryAccent'} animate-pulse`} />
              <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">
                {isAdmin ? 'System Admin' : 'Advisor'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/5 text-textMuted hover:text-coralAccent hover:border-coralAccent/25 hover:bg-coralAccent/5 active:scale-[0.98] group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-darkBg text-textPrimary overflow-hidden">

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-60 bg-cardBg/90 border-r border-white/5 flex-col justify-between z-10 shrink-0 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-64 max-w-[82vw] bg-cardBg border-r border-white/5 flex flex-col h-full shadow-2xl z-50 animate-slide-in">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-4 p-2 bg-surfaceBg/80 rounded-lg border border-white/5 text-textMuted hover:text-coralAccent transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-[72px] bg-cardBg/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">

          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2.5 bg-surfaceBg/80 border border-white/5 rounded-xl text-textPrimary hover:bg-primaryAccent/10 hover:border-primaryAccent/20 hover:text-primaryAccent transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-textMuted text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-primaryAccent" />
              <span>{formattedDate}</span>
            </div>

            <span className="md:hidden font-extrabold text-sm text-gradient-brand">
              EFCG Portal
            </span>
          </div>

          {/* Right accessories */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Live status pill */}
            <div className="flex items-center gap-2 bg-secondaryAccent/8 border border-secondaryAccent/15 px-3 py-2 rounded-xl">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondaryAccent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondaryAccent" />
              </span>
              <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider text-secondaryAccent">
                Live
              </span>
            </div>

            {/* Role badge */}
            <div className={`text-[10px] md:text-[11px] px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border whitespace-nowrap ${
              isAdmin
                ? 'bg-goldAccent/8 border-goldAccent/15 text-goldAccent'
                : 'bg-primaryAccent/8 border-primaryAccent/15 text-primaryAccent'
            }`}>
              <Zap className="w-3 h-3" />
              {isAdmin ? 'ADMIN' : 'ADVISOR'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-darkBg p-4 md:p-8 relative">
          {/* Ambient bg glow */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-primaryAccent/[0.025] blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-secondaryAccent/[0.02] blur-[80px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 fade-in relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
