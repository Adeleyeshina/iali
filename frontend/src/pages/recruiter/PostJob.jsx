import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { LAUNCH } from '../../data/launchAreas.js';
export default function PostJob() {
  const [f, setF] = useState({ title: '', description: '', workMode: 'onsite', city: 'Lagos', clientName: '' });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const post = async () => {
    try { setErr(''); setRes(await api('/api/jobs', { method: 'POST', body: f })); }
    catch (e) { setErr(e.message + ' — log in as a recruiter in a company first.'); }
  };
  const toRemote = async () => {
    const j = await api(`/api/jobs/${res.id}/to-remote`, { method: 'PATCH', body: {} });
    setRes({ ...res, ...j, notice: null });
  };
  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>Post a job 💼</h2>
      <p className="mut">Free forever in this release · first post reviewed before going live.</p>
      <div className="steps"><span className="step on" /><span className={`step ${f.title && f.description ? 'on' : ''}`} /><span className={`step ${res ? 'on' : ''}`} /></div>
      <label className="lbl">Role title</label><input placeholder="e.g. Frontend Developer" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <label className="lbl">What will they do?</label><textarea rows="4" placeholder="Stack, responsibilities, salary range (optional)…" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <div className="grid2">
        <div><label className="lbl">Work mode</label>
          <select value={f.workMode} onChange={(e) => setF({ ...f, workMode: e.target.value })}><option>onsite</option><option>hybrid</option><option>remote</option></select></div>
        {f.workMode !== 'remote' && <div><label className="lbl">City (dropdown — no free text)</label>
          <select value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{LAUNCH.map((l) => <option key={l.city}>{l.city}</option>)}<option>Enugu</option><option>Abuja</option><option>Port Harcourt</option></select></div>}
      </div>
      <label className="lbl">Agency? Client name (shown as “posted on behalf of…”)</label>
      <input placeholder="Optional" value={f.clientName} onChange={(e) => setF({ ...f, clientName: e.target.value })} />
      {err && <p className="flag">{err}</p>}
      <button className="btn block" onClick={post}>Publish role →</button>
      {res && (
        <div className="card" style={{ background: 'var(--g50)' }}>
          <b>✓ Saved as {res.status}</b>
          {res.notice ? (<><p className="mut">{res.notice}</p><button className="btn ghost" onClick={toRemote}>Switch to remote — reach all Nigeria</button></>)
            : <p className="mut">Live and ranking in the feed. <Link to={`/jobs/${res.id}`}>View it →</Link></p>}
        </div>
      )}
    </div>
  );
}
