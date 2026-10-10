import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', role: 'candidate', phone: '' });
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const go = async () => {
    try {
      setErr('');
      const r = await api('/api/auth/signup', { method: 'POST', body: { ...form, consentVersion: 'v1' } });
      setMsg(r.confirmToken);
    } catch (e) { setErr(e.message); }
  };
  const confirm = async () => { await api('/api/auth/confirm', { method: 'POST', body: { token: msg } }); setMsg('done'); };
  return (
    <div className="card auth">
      <div className="auth-side"><h2>Join free in 2 minutes 🚀</h2><p style={{ color: '#d6e9dc' }}>One account for both sides. Candidates get found, recruiters hire without paying job boards.</p>
        <ul><li>📄 CV → profile, reviewed by you</li><li>🔍 Recruiter search + direct chat</li><li>🛡 Verification badges + scam removal</li></ul></div>
      <div className="auth-form">
        <h2 style={{ margin: '0 0 4px' }}>Create account</h2><p className="mut">Have one? <Link to="/login">Log in</Link></p>
        <div className="grid2">
          <button className={'chip' + (form.role === 'candidate' ? ' on' : '')} onClick={() => setForm({ ...form, role: 'candidate' })}>🎓 I'm job hunting</button>
          <button className={'chip' + (form.role === 'recruiter' ? ' on' : '')} onClick={() => setForm({ ...form, role: 'recruiter' })}>💼 I'm hiring</button>
        </div>
        <label className="lbl">Email{form.role === 'recruiter' && ' (company domain for verification)'}</label>
        <input placeholder={form.role === 'recruiter' ? 'you@company.ng' : 'you@example.com'} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="lbl">Password</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="lbl">Phone (OTP later)</label><input placeholder="080…" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {err && <p className="flag">{err}</p>}
        <button className="btn block" onClick={go}>Create free account</button>
        {msg && msg !== 'done' && <div className="card" style={{ background: 'var(--g50)' }}><b>Check your inbox ✉️</b><p className="mut">Dev mode: confirm straight away, no mail server needed.</p><button className="btn ghost" onClick={confirm}>Confirm email now</button></div>}
        {msg === 'done' && <p className="badge">✓ Confirmed — <Link to="/login">log in</Link></p>}
        <p className="mut">Signing up = consent to data processing (v1) for matching + hiring. Recruiters need a company-domain email.</p>
      </div>
    </div>
  );
}
