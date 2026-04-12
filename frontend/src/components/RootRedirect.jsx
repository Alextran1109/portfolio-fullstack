import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/signin'} replace />;
}
