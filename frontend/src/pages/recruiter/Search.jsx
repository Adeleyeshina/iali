import { useState } from 'react';
import EmptyState from '../../components/EmptyState.jsx';
import { api } from '../../lib/api.js';
export default function Search() {
  const [q, setQ] = useState('');
  const [out, setOut] = useState(null);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState({});
  const go = async () => { try { setMsg(''); setOut(null); setOut(await api('/api/search/candidates?q=' + encodeURIComponent(q))); } catch (e) { setMsg(e.message); setOut([]); } };
  const contact = async (candidateId) => {
    const subject = prompt('First message — role + company required (e.g. Frontend Dev @ TechStartup Ltd):');
    if (!subject) return;
    try { await api('/api/conversations', { method: 'POST', body: { candidateId, subject } }); setSent({ ...sent, [candidateId]: true }); }
    catch (e) { alert(e.message); }
  };
  return (
    <div>
      <h2 style={{ letterSpacing: '-.5px', marginBottom: 2 }}>Find talent 🔍</h2>
      <p className="mut">Verified companies only · contact details stay hidden · outreach happens inside Iali.</p>
      <div className="card" style={{ padding: 12 }}>
        <input placeholder="Skill, headline or city — e.g. React, Lagos…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
        <button className="btn block" onClick={go}>Search candidates</button>
      </div>
      {msg && <div className="card">🔒 {msg} — complete verification to unlock search + messaging.</div>}
      {!out && !msg && <EmptyState icon="✨" title="Shortlist in minutes" hint="Search react, filter Lagos, message the best — daily limits + contact prefs keep it spam-free." />}
      {(out || []).map((p) => (
        <div className="card" key={p.userId}>
          <b>{p.headline || 'Candidate'}</b>
          <p className="mut" style={{ margin: '4px 0' }}>{(p.skills || []).join(' · ') || 'Skills not listed'} · 📍 {p.city || '—'} · {p.availability || ''}</p>
          <div className="tagrow"><span className="badge">{p.workModePref || 'remote'}</span>{p.willingRelocate && <span className="badge">open to relocate</span>}</div>
          <div style={{ marginTop: 10 }}>{sent[p.userId] ? <span className="badge">✓ Message sent</span> : <button className="btn sm" onClick={() => contact(p.userId)}>Message →</button>}</div>
        </div>
      ))}
    </div>
  );
}
