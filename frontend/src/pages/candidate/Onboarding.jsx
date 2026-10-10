import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
export default function Onboarding() {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [err, setErr] = useState('');
  const step = !parsed ? 1 : 2;
  const parse = async () => { try { setErr(''); setParsed(await api('/api/profile/parse', { method: 'POST', body: { text } })); } catch (e) { setErr(e.message); } };
  const save = async () => {
    await api('/api/profile', { method: 'PUT', body: { headline: parsed.parsed.headline, skills: parsed.parsed.skills, summary: parsed.parsed.summary, city: 'Lagos', searchable: true, availability: 'Actively looking' } });
    setParsed({ ...parsed, saved: true });
  };
  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>Build your profile 📄</h2>
      <p className="mut">Paste your CV → review what we pick up → save. Nothing saves without your OK.</p>
      <div className="steps"><span className={`step ${step >= 1 ? 'on' : ''}`} /><span className={`step ${step >= 2 ? 'on' : ''}`} /><span className={`step ${parsed?.saved ? 'on' : ''}`} /></div>
      {!parsed && (<>
        <label className="lbl">Step 1 — paste CV text</label>
        <textarea rows="7" placeholder="e.g. Adaeze O. — Frontend developer, 4 years React, JavaScript, CSS, Lagos…" value={text} onChange={(e) => setText(e.target.value)} />
        {err && <p className="flag">{err}</p>}
        <button className="btn block" onClick={parse} disabled={text.trim().length < 20}>Extract my details →</button>
        <p className="mut">Tip: include skills + years + city. File upload lands in the next release.</p>
      </>)}
      {parsed && !parsed.saved && (
        <div><label className="lbl">Step 2 — review before saving</label>
          <div className="card" style={{ background: 'var(--g50)' }}>
            <b>{parsed.parsed.headline || 'Your headline'}</b>
            <p className="mut">{parsed.parsed.summary}</p>
            <div className="tagrow">{(parsed.parsed.skills || []).map((s) => <span key={s} className="badge">{s}</span>)}</div>
            {parsed.parsed.experienceYears && <p className="mut">Detected: {parsed.parsed.experienceYears} yrs experience</p>}
          </div>
          <div className="grid2"><button className="btn ghost" onClick={() => setParsed(null)}>← Edit text</button><button className="btn" onClick={save}>Looks good — save ✓</button></div>
        </div>
      )}
      {parsed?.saved && <div className="card empty"><div className="big">🎉</div><h3>Profile live!</h3><p className="mut">Verified recruiters can now find and message you.</p><Link className="btn" to="/profile">Polish my profile →</Link></div>}
    </div>
  );
}
