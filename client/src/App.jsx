import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/AppShell';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CurrencyConversion from './pages/CurrencyConversion';
import InvestmentPlanner from './pages/InvestmentPlanner';
import ClientRecords from './pages/ClientRecords';
import TransactionHistory from './pages/TransactionHistory';
import Administration from './pages/Administration';

/** Wraps protected routes — redirects to /login if not authenticated */
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="bg-cardBg border border-errorColor/30 text-errorColor rounded-xl p-10 text-center max-w-sm">
          <p className="text-2xl font-bold mb-2">Access Denied</p>
          <p className="text-sm text-textMuted">Administrator privileges are required to view this page.</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected advisor routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/convert"   element={<ProtectedRoute><CurrencyConversion /></ProtectedRoute>} />
      <Route path="/invest"    element={<ProtectedRoute><InvestmentPlanner /></ProtectedRoute>} />
      <Route path="/clients"   element={<ProtectedRoute><ClientRecords /></ProtectedRoute>} />
      <Route path="/history"   element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

      {/* Admin-only route */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Administration /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
