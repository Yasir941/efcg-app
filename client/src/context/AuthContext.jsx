import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

// Token version — bump this whenever the backend token format changes.
// Any stored token from a previous session with a different version is purged.
const TOKEN_VERSION = 'v2-atlas';

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedVersion = localStorage.getItem('efcg_token_version');
    const storedToken   = localStorage.getItem('efcg_token');
    const storedUser    = localStorage.getItem('efcg_user');

    // If the stored token belongs to an old session (in-memory server), clear it
    if (storedToken && storedVersion !== TOKEN_VERSION) {
      localStorage.clear();
      setLoading(false);
      return;
    }

    if (storedToken && storedUser) {
      // Basic JWT expiry check (decode payload without verifying signature)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp && Date.now() / 1000 > payload.exp) {
          // Token has expired — clear everything
          localStorage.clear();
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: t, user: u } = res.data;

      localStorage.setItem('efcg_token',         t);
      localStorage.setItem('efcg_user',          JSON.stringify(u));
      localStorage.setItem('efcg_token_version', TOKEN_VERSION);

      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: t, user: u } = res.data;

      localStorage.setItem('efcg_token',         t);
      localStorage.setItem('efcg_user',          JSON.stringify(u));
      localStorage.setItem('efcg_token_version', TOKEN_VERSION);

      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to register';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Always clear locally even if backend call fails
    } finally {
      localStorage.removeItem('efcg_token');
      localStorage.removeItem('efcg_user');
      localStorage.removeItem('efcg_token_version');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin:         user?.role === 'admin',
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
