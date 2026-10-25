import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

import {
  DEMO_CANDIDATE_USER,
  DEMO_RECRUITER_USER,
  DEMO_ADMIN_USER,
} from '../data/demoData.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from /api/me if token exists
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('iali_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    if (token === 'demo-token') {
      const saved = localStorage.getItem('iali_demo_user');
      const demoUser = saved ? JSON.parse(saved) : DEMO_CANDIDATE_USER;
      setUser(demoUser);
      setLoading(false);
      return demoUser;
    }
    try {
      const userData = await api('/api/me');
      setUser(userData);
      return userData;
    } catch {
      localStorage.removeItem('iali_token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (token, initialUser) => {
    if (token) {
      localStorage.setItem('iali_token', token);
    }
    if (initialUser) {
      setUser(initialUser);
    }
    try {
      const freshUser = await api('/api/me');
      if (freshUser) {
        setUser(freshUser);
        return freshUser;
      }
    } catch {
      // keep initialUser if /api/me fails temporarily
    }
    return initialUser;
  }, []);

  const loginAsDemo = useCallback((role = 'candidate') => {
    let demoUser = DEMO_CANDIDATE_USER;
    if (role === 'recruiter') demoUser = DEMO_RECRUITER_USER;
    if (role === 'admin') demoUser = DEMO_ADMIN_USER;

    localStorage.setItem('iali_token', 'demo-token');
    localStorage.setItem('iali_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setLoading(false);
    return demoUser;
  }, []);

  const logout = useCallback((redirectUrl = '/signup') => {
    localStorage.removeItem('iali_token');
    localStorage.removeItem('iali_demo_user');
    setUser(null);
    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  }, []);

  const updateUser = useCallback((updated) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : updated));
  }, []);

  const value = {
    user,
    loading,
    login,
    loginAsDemo,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: Boolean(user),
    isDemo: user?.isDemo || localStorage.getItem('iali_token') === 'demo-token',
    isCandidate: user?.role === 'candidate',
    isRecruiter: user?.role === 'recruiter',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
