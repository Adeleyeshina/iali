import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../lib/api.js';

export default function Login({ user, onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace />;
  }

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
        const currentUser = await api('/api/me').catch(() => response.user);
        if (currentUser) onAuth(currentUser);
      }

      // Return to original protected page or previous location if present; otherwise default to '/'
      let destination = '/';
      const from = location.state?.from;

      if (typeof from === 'string' && from.trim() && from !== '/login' && from !== '/signup') {
        destination = from;
      } else if (from && typeof from === 'object' && from.pathname) {
        if (from.pathname !== '/login' && from.pathname !== '/signup') {
          destination = `${from.pathname}${from.search || ''}${from.hash || ''}`;
        }
      }

      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] bg-white border border-zinc-200 rounded-2xl p-7 md:p-9 shadow-sm">
        {/* Brand Icon and Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-extrabold text-xl shadow mb-3">
            i
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">
            New here?{' '}
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="font-semibold text-zinc-900 underline underline-offset-4 hover:text-black"
            >
              Create a free account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold tracking-wide transition shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Logging in…' : 'Log in'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Verification trust badge with green status indicator */}
        <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified direct employer network</span>
        </div>
      </div>
    </div>
  );
}
