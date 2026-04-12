import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signup as signupRequest } from '../services/auth';

export default function SignUp() {
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
      const r = await signupRequest(email, password);
      if (!r.success || !r.data?.token) {
        throw new Error(r.message || 'Sign up failed');
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
      <h1>Sign up</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form-grid" data-cy="signup-form">
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-cy="signup-email"
          />
        </label>
        <label>
          Password (min 6 characters)
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-cy="signup-password"
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={loading} data-cy="signup-submit">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      </form>
      <p className="muted">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}
