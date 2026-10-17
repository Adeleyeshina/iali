import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      localStorage.setItem('iali_token', response.token);

      if (onAuth) {
        const currentUser = await api('/api/me');
        onAuth(currentUser);
      }

      // Redirect back to original destination or home
      const destination = location.state?.from
        ? `${location.state.from.pathname}${location.state.from.search || ''}`
        : '/';

      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth">
      <div className="auth-side">
        <h2>Welcome back 👋</h2>
        <p style={{ color: '#d6e9dc' }}>
          Jobs find you here. Verified roles, one-tap apply, live tracking.
        </p>

        <ul>
          <li>✓ Only verified companies message</li>
          <li>✓ Never pay to apply</li>
          <li>✓ Lagos · Ibadan · Remote</li>
        </ul>
      </div>

      <div className="auth-form">
        <h2 style={{ margin: '0 0 4px' }}>Log in</h2>
        <p className="mut">
          New here? <Link to="/signup">Create a free account</Link>
        </p>

        <label className="lbl">Email</label>
        <input
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <label className="lbl">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          disabled={loading}
        />

        {errorMessage && <p className="flag">{errorMessage}</p>}

        <button
          className="btn block"
          onClick={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? 'Logging in…' : 'Log in →'}
        </button>
      </div>
    </div>
  );
}
