import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import SignupSidebar from '../components/auth/SignupSidebar.jsx';
import RoleSelector from '../components/auth/RoleSelector.jsx';
import CandidateFields from '../components/auth/CandidateFields.jsx';
import RecruiterFields from '../components/auth/RecruiterFields.jsx';
import { isAppSubdomain, getAppUrl } from '../lib/subdomain.js';

// Signup screen with candidate and recruiter persona toggles
export default function Signup({ user: propUser, onAuth }) {
  const { user: authUser, login } = useAuth();
  const user = propUser !== undefined ? propUser : authUser;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    phone: '',
    availability: 'Actively looking for a job',
    companyName: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      setErrorMessage('');

      if (!formData.name.trim()) {
        throw new Error('Please enter your full name.');
      }
      if (!formData.email.trim() || !formData.password.trim()) {
        throw new Error('Please fill in your email and password.');
      }
      if (formData.role === 'recruiter' && !formData.companyName.trim()) {
        throw new Error('Please enter your company or business name.');
      }

      const response = await api('/api/auth/signup', {
        method: 'POST',
        body: {
          ...formData,
          consentVersion: 'v1',
        },
      });

      if (response.confirmToken) {
        api('/api/auth/confirm', {
          method: 'POST',
          body: { token: response.confirmToken },
        }).catch(() => {});
      }

      const draftProfile = sessionStorage.getItem('iali_draft_profile');
      if (draftProfile && formData.role === 'candidate') {
        try {
          const parsed = JSON.parse(draftProfile);
          await api('/api/profile', {
            method: 'PUT',
            body: {
              headline: parsed.headline,
              skills: parsed.skills,
              summary: parsed.summary,
              city: parsed.city || 'Lagos',
              searchable: true,
              availability: formData.availability,
            },
          });
          sessionStorage.removeItem('iali_draft_profile');
        } catch {
          // ignore draft saving errors
        }
      }

      const loggedInUser = await login(response.token, response.user);
      if (onAuth) {
        onAuth(loggedInUser || response.user);
      }

      if (isAppSubdomain()) {
        navigate('/dashboard', { replace: true });
      } else {
        const isProdDomain =
          typeof window !== 'undefined' &&
          !window.location.hostname.includes('localhost') &&
          !window.location.hostname.includes('127.0.0.1');

        if (isProdDomain) {
          const targetUrl = getAppUrl('/dashboard');
          const sep = targetUrl.includes('?') ? '&' : '?';
          window.location.href = `${targetUrl}${sep}auth_token=${encodeURIComponent(response.token)}`;
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto my-4 sm:my-8 bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-[380px_1fr]">
      {/* Mobile-only compact brand trust header */}
      <div className="md:hidden px-5 py-3.5 bg-gradient-hero text-white flex items-center justify-between text-xs border-b border-indigo-900/40">
        <span className="flex items-center gap-2 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Join ialihub Free</span>
        </span>
        <span className="text-[11px] text-indigo-200 font-medium">NDPR & CAC Vetted</span>
      </div>

      {/* Desktop marketing sidebar */}
      <div className="hidden md:flex">
        <SignupSidebar />
      </div>

      <div className="p-5 sm:p-7 md:p-9 space-y-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

        <RoleSelector
          role={formData.role}
          onChangeRole={(newRole) => setFormData({ ...formData, role: newRole })}
        />

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Babatunde Adeyemi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Email *
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-2xs"
              />
            </div>
          </div>

          {formData.role === 'candidate' ? (
            <CandidateFields formData={formData} setFormData={setFormData} />
          ) : (
            <RecruiterFields formData={formData} setFormData={setFormData} />
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-sm sm:text-base font-bold tracking-wide transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Setting up your profile…' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4 text-coral-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
