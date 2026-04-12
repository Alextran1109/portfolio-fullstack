import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import RootRedirect from './components/RootRedirect';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import References from './pages/References';
import Services from './pages/Services';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Users from './pages/Users';

function AppHeader() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      <div>Portfolio Admin</div>
      <nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              Users
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>
              Services
            </NavLink>
            <NavLink to="/references" className={({ isActive }) => (isActive ? 'active' : '')}>
              References
            </NavLink>
            <button type="button" className="header-link-btn" onClick={logout} data-cy="logout">
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/signin" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sign in
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sign up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <>
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/signin"
            element={
              <PublicOnlyRoute>
                <SignIn />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignUp />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/references"
            element={
              <ProtectedRoute>
                <References />
              </ProtectedRoute>
            }
          />
          <Route path="/projects" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
}
