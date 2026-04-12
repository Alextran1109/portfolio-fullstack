import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { emitPortfolioAuthChanged } from '../authEvents';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  useEffect(() => {
    const syncFromStorage = () => {
      const next = localStorage.getItem('token');
      setToken((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('focus', syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('focus', syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  const setSession = useCallback((nextToken) => {
    if (nextToken) {
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('token');
    }
    setToken(nextToken);
    emitPortfolioAuthChanged();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    emitPortfolioAuthChanged();
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setSession,
      logout,
    }),
    [token, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
