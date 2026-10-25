import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

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

  const logout = useCallback((redirectUrl = '/signup') => {
    localStorage.removeItem('iali_token');
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
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: Boolean(user),
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
