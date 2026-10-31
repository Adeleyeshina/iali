import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

import Logo from '../components/Logo.jsx';
import { isAppSubdomain, getAppUrl, canUseSubdomains } from '../lib/subdomain.js';

export default function Login({ user: propUser, onAuth }) {
  const { user: authUser, login, loginAsDemo } = useAuth();
  const user = propUser !== undefined ? propUser : authUser;

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

      const loggedInUser = await login(response.token, response.user);
      if (onAuth) onAuth(loggedInUser || response.user);

      // Return to original protected page or previous location if present; otherwise default to '/dashboard'
      let destination = '/dashboard';
      const from = location.state?.from;

      if (typeof from === 'string' && from.trim() && from !== '/login' && from !== '/signup' && from !== '/') {
        destination = from;
      } else if (from && typeof from === 'object' && from.pathname) {
        if (from.pathname !== '/login' && from.pathname !== '/signup' && from.pathname !== '/') {
          destination = `${from.pathname}${from.search || ''}${from.hash || ''}`;
        }
      }

      if (!canUseSubdomains() || isAppSubdomain()) {
        navigate(destination, { replace: true });
      } else {
        const targetUrl = getAppUrl(destination);
        const sep = targetUrl.includes('?') ? '&' : '?';
        window.location.href = `${targetUrl}${sep}auth_token=${encodeURIComponent(response.token)}`;
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 md:p-9 shadow-xl shadow-indigo-950/5">
        {/* Brand Logo and Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-600 mt-1">
            New here?{' '}
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
            >
              Create a free account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
            />
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-sm font-bold tracking-wide transition shadow-md shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Logging in…' : 'Log in'}</span>
            <ArrowRight className="w-4 h-4 text-coral-300" />
          </button>
        </div>

        {/* Quick Demo Preview Section (No Registration Needed) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Quick Interactive Demo (No sign-up required)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsDemo('candidate');
                navigate('/profile');
              }}
              className="py-2.5 px-2 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer text-center"
              title="Preview candidate dashboard, job applications, and match scores"
            >
              <span>Job Seeker</span>
              <span className="text-[10px] font-normal text-indigo-600">Adaeze</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsDemo('recruiter');
                navigate('/recruiter/jobs');
              }}
              className="py-2.5 px-2 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer text-center"
              title="Preview employer job postings, applicant pipeline, and talent search"
            >
              <span>Employer</span>
              <span className="text-[10px] font-normal text-emerald-600">TechLagos</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsDemo('admin');
                navigate('/admin');
              }}
              className="py-2.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer text-center"
              title="Preview Trust Centre moderation queues and city demand"
            >
              <span>Admin</span>
              <span className="text-[10px] font-normal text-slate-500">Trust Centre</span>
            </button>
          </div>
        </div>

        {/* Security & Verification trust badge with green status indicator */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified direct employer network</span>
        </div>
      </div>
    </div>
  );
}
