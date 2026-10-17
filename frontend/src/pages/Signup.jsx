import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'candidate',
    phone: '',
  });
  const [confirmationToken, setConfirmationToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleSignup = async () => {
    if (loading) return;
    setLoading(true);

    try {
      setErrorMessage('');
      const response = await api('/api/auth/signup', {
        method: 'POST',
        body: { ...formData, consentVersion: 'v1' },
      });
      setConfirmationToken(response.confirmToken);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmail = async () => {
    if (confirming) return;
    setConfirming(true);

    try {
      await api('/api/auth/confirm', {
        method: 'POST',
        body: { token: confirmationToken },
      });
      setConfirmationToken('done');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setConfirming(false);
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

        {confirmationToken && confirmationToken !== 'done' && (
          <div className="card" style={{ background: 'var(--g50)' }}>
            <b>Check your inbox ✉️</b>
            <p className="mut">Dev mode: confirm straight away, no mail server needed.</p>
            <button
              className="btn ghost"
              onClick={handleConfirmEmail}
              disabled={confirming}
            >
              {confirming ? 'Confirming…' : 'Confirm email now'}
            </button>
          </div>
        )}

        {confirmationToken === 'done' && (
          <p className="badge">
            ✓ Confirmed — <Link to="/login">log in</Link>
          </p>
        )}

        <p className="mut">
          Signing up = consent to data processing (v1) for matching + hiring. Recruiters need a
          company-domain email.
        </p>
      </div>
    </div>
  );
}
