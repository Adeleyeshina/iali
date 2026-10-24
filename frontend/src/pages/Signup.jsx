import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  Rocket,
  Check,
  User,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Award,
  Target,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { api } from '../lib/api.js';

const CANDIDATE_STATUS_OPTIONS = [
  {
    value: 'Actively looking for a job',
    label: 'Actively looking for a job',
    sub: 'Immediate start',
    dotBg: 'bg-emerald-500',
  },
  {
    value: 'Employed, but open to opportunities',
    label: 'Employed, open to offers',
    sub: 'Open to better roles',
    dotBg: 'bg-amber-500',
  },
  {
    value: 'Employed, not looking',
    label: 'Employed, not looking',
    sub: 'Networking only',
    dotBg: 'bg-blue-500',
  },
  {
    value: 'Just exploring / curious',
    label: 'Just exploring / curious',
    sub: 'Salary & market research',
    dotBg: 'bg-purple-500',
  },
];

// Signup page with candidate / recruiter persona toggle
export default function Signup({ user, onAuth }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate', // 'candidate' | 'recruiter'
    phone: '',
    availability: 'Actively looking for a job',
    companyName: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect away from signup
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

      if (response.token) {
        localStorage.setItem('iali_token', response.token);
      }

      // Auto-confirm token in background
      if (response.confirmToken) {
        api('/api/auth/confirm', {
          method: 'POST',
          body: { token: response.confirmToken },
        }).catch(() => {});
      }

      // If user had a draft profile from homepage CV drop, save it now
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

      if (onAuth) {
        const currentUser = response.user || (await api('/api/me').catch(() => null));
        if (currentUser) onAuth(currentUser);
      }

      // Redirect to home dashboard
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-[340px_1fr]">
      {/* Left Sidebar */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white p-7 md:p-8 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Join Iali free</h2>
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-5">
            Nigeria's verified hiring network. Candidates get discovered without agencies; verified employers hire without middleman fees.
          </p>

          <ul className="space-y-2.5 text-xs md:text-sm text-zinc-300 mb-6 pl-0 list-none">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% free for job seekers & hiring teams</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified company badges — zero recruiter scams</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lagos & Ibadan onsite · Nationwide remote</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct chat & live application tracking</span>
            </li>
          </ul>

          {/* Social Proof */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <p className="text-xs text-zinc-200 italic leading-relaxed mb-2.5">
              “I uploaded my CV, got found directly by a fintech in Lagos, and received an offer in under 2 weeks. Zero agent stress.”
            </p>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                <User className="w-3.5 h-3.5 text-white" />
              </span>
              <div>
                <b className="text-xs text-white block">Adaeze O.</b>
                <span className="text-[11px] text-zinc-400">Frontend Developer · Lagos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Guarantee */}
        <div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <b className="text-xs text-white">Scam-Free Guarantee</b>
            </div>
            <span className="text-[11px] text-zinc-400 leading-normal block">
              Every employer domain and initial job post is verified before candidate outreach. Never pay to apply.
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-zinc-400 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>2-min setup</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Verified badges</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Award className="w-3 h-3 text-zinc-400" />
              <span>₦0 fees</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">Create your account</h2>
        <p className="text-xs md:text-sm text-zinc-500 mb-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-zinc-950 underline underline-offset-4 hover:text-black">
            Log in here
          </Link>
        </p>

        {/* Persona / Role Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Select your account type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              className={`p-3 rounded-2xl border transition cursor-pointer ${
                formData.role === 'candidate'
                  ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
              onClick={() => setFormData({ ...formData, role: 'candidate' })}
              role="button"
              tabIndex={0}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-zinc-900" />
                  <span className="text-sm font-bold text-zinc-900">Job Seeker</span>
                </div>
                {formData.role === 'candidate' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 m-0">
                Looking for a job. Browse openings and get found by recruiters.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition cursor-pointer ${
                formData.role === 'recruiter'
                  ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
              onClick={() => setFormData({ ...formData, role: 'recruiter' })}
              role="button"
              tabIndex={0}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-zinc-900" />
                  <span className="text-sm font-bold text-zinc-900">Employer / Hirer</span>
                </div>
                {formData.role === 'recruiter' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 m-0">
                Looking to hire. Post roles free and search candidate profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Candidate Employment Status Selector */}
        {formData.role === 'candidate' && (
          <div className="mb-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
            <label className="block text-xs font-bold text-zinc-800 mb-2">
              What is your current employment status?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CANDIDATE_STATUS_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2 cursor-pointer transition ${
                    formData.availability === opt.value
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                  }`}
                  onClick={() => setFormData({ ...formData, availability: opt.value })}
                >
                  <span className={`w-2 h-2 rounded-full ${opt.dotBg} shrink-0`} />
                  <span className="truncate">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter Company Name Input */}
        {formData.role === 'recruiter' && (
          <div className="mb-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Company / Business Name *
            </label>
            <input
              placeholder="e.g. Flutterwave, Paystack, TechCorp Ltd"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            {formData.role === 'recruiter' ? 'Work Email (company domain required) *' : 'Email Address *'}
          </label>
          <input
            type="email"
            placeholder={formData.role === 'recruiter' ? 'you@company.ng' : 'you@example.com'}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Password (min 6 characters) *
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            required
          />
        </div>

        {/* Full Name & Phone in Side-by-Side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Full Name *
            </label>
            <input
              placeholder="e.g. Tunde Bakare"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Phone (optional)
            </label>
            <input
              type="tel"
              placeholder="08012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim()}
          className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold tracking-wide transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>{loading ? 'Creating account…' : formData.role === 'candidate' ? 'Join as Job Seeker' : 'Join as Employer'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-zinc-400 text-center mt-3 leading-normal">
          By creating an account, you agree to Iali's terms of service. Free forever for job seekers and hiring teams.
        </p>
      </div>
    </div>
  );
}
