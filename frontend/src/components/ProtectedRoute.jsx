import { useSyncExternalStore } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PORTFOLIO_AUTH_CHANGED } from '../authEvents';

function getTokenSnapshot() {
  if (typeof window === 'undefined') return null;
  const t = localStorage.getItem('token');
  return t && t.trim() ? t : null;
}

function getTokenServerSnapshot() {
  return null;
}

function subscribeToken(onStoreChange) {
  if (typeof window === 'undefined') return () => {};
  const run = () => onStoreChange();
  window.addEventListener('focus', run);
  window.addEventListener('storage', run);
  window.addEventListener(PORTFOLIO_AUTH_CHANGED, run);
  document.addEventListener('visibilitychange', run);
  return () => {
    window.removeEventListener('focus', run);
    window.removeEventListener('storage', run);
    window.removeEventListener(PORTFOLIO_AUTH_CHANGED, run);
    document.removeEventListener('visibilitychange', run);
  };
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = useSyncExternalStore(subscribeToken, getTokenSnapshot, getTokenServerSnapshot);

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  return children;
}
