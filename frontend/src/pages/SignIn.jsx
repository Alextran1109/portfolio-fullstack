import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as loginRequest } from '../services/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await loginRequest(email, password);
      if (!r.success || !r.data?.token) {
        throw new Error(r.message || 'Login failed');
      }
      localStorage.setItem('token', r.data.token);
      setSession(r.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form-grid" data-cy="signin-form">
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-cy="signin-email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-cy="signin-password"
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={loading} data-cy="signin-submit">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
      <p className="muted">
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
