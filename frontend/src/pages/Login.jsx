import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
export default function Login({ onAuth }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [err, setErr] = useState('');
  const nav = useNavigate();
  const go = async () => {
    try { const r = await api('/api/auth/login', { method: 'POST', body: { email, password } }); localStorage.setItem('iali_token', r.token); onAuth && onAuth(await api('/api/me')); nav('/jobs'); }
    catch (e) { setErr(e.message); }
  };
  return (
    <div className="card auth">
      <div className="auth-side"><h2>Welcome back 👋</h2><p style={{ color: '#d6e9dc' }}>Jobs find you here. Verified roles, one-tap apply, live tracking.</p>
        <ul><li>✓ Only verified companies message</li><li>✓ Never pay to apply</li><li>✓ Lagos · Ibadan · Remote</li></ul></div>
      <div className="auth-form">
        <h2 style={{ margin: '0 0 4px' }}>Log in</h2><p className="mut">New here? <Link to="/signup">Create a free account</Link></p>
        <label className="lbl">Email</label><input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="lbl">Password</label><input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
        {err && <p className="flag">{err}</p>}
        <button className="btn block" onClick={go}>Log in →</button>
      </div>
    </div>
  );
}
