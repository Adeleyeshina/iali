import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Signup({ user, onAuth }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'candidate',
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignup = async () => {
    if (loading) return;
    setLoading(true);

    try {
      setErrorMessage('');
      const response = await api('/api/auth/signup', {
        method: 'POST',
        body: { ...formData, consentVersion: 'v1' },
      });

      if (response.token) {
        localStorage.setItem('iali_token', response.token);
      }

      // Auto-confirm token in background so user is verified immediately
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
              availability: 'Actively looking',
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

      // Redirect directly to / as requested
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth">
      <div className="auth-side">
        <h2>Join free in 2 minutes 🚀</h2>
        <p style={{ color: '#d6e9dc' }}>
          One account for both sides. Candidates get found, recruiters hire without paying job boards.
        </p>

        <ul>
          <li>📄 CV → profile, reviewed by you</li>
          <li>🔍 Recruiter search + direct chat</li>
          <li>🛡 Verification badges + scam removal</li>
        </ul>
      </div>

      <div className="auth-form">
        <h2 style={{ margin: '0 0 4px' }}>Create account</h2>
        <p className="mut">
          Have one? <Link to="/login">Log in</Link>
        </p>

        <div className="grid2">
          <button
            type="button"
            className={'chip' + (formData.role === 'candidate' ? ' on' : '')}
            onClick={() => setFormData({ ...formData, role: 'candidate' })}
            disabled={loading}
          >
            🎓 I'm job hunting
          </button>
          <button
            type="button"
            className={'chip' + (formData.role === 'recruiter' ? ' on' : '')}
            onClick={() => setFormData({ ...formData, role: 'recruiter' })}
            disabled={loading}
          >
            💼 I'm hiring
          </button>
        </div>

        <label className="lbl">
          Email{formData.role === 'recruiter' && ' (company domain for verification)'}
        </label>
        <input
          placeholder={formData.role === 'recruiter' ? 'you@company.ng' : 'you@example.com'}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
        />

        <label className="lbl">Password</label>
        <input
          type="password"
          placeholder="Min 6 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={loading}
        />

        <label className="lbl">Phone (OTP later)</label>
        <input
          placeholder="080…"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={loading}
        />

        {errorMessage && <p className="flag">{errorMessage}</p>}

        <button
          className="btn block"
          onClick={handleSignup}
          disabled={loading || !formData.email.trim() || !formData.password.trim()}
        >
          {loading ? 'Creating account…' : 'Create free account'}
        </button>

        <p className="mut">
          Signing up = consent to data processing (v1) for matching + hiring. Recruiters need a
          company-domain email.
        </p>
      </div>
    </div>
  );
}
