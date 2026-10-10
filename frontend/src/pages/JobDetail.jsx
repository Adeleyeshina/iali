import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initials } from '../components/JobCard.jsx';
import { api } from '../lib/api.js';
export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');
  useEffect(() => { api('/api/jobs/' + id).then(setJob).catch((e) => setErr(e.message)); }, [id]);
  const apply = async () => {
    try { const r = await api(`/api/jobs/${id}/apply`, { method: 'POST', body: {} }); setDone('Application sent ✓' + (r.notice ? ' — ' + r.notice : '')); }
    catch (e) { setErr(e.message + ' — candidates: log in first.'); }
  };
  if (err && !job) return <div className="card">{err} <Link to="/jobs">← Back to jobs</Link></div>;
  if (!job) return <div className="sk" />;
  const co = job.company || {};
  return (
    <>
      <Link to="/jobs" className="mut" style={{ textDecoration: 'none', fontWeight: 700 }}>← All jobs</Link>
      <div className="card">
        <div className="comp-hdr">
          <span className="avatar" style={{ width: 56, height: 56 }}>{initials(co.name)}</span>
          <div><h2 style={{ margin: 0, letterSpacing: '-.5px' }}>{job.title}</h2>
            <div className="mut">{co.name} · {job.workMode} · {job.city || 'Remote · Nigeria'}</div></div>
        </div>
        <div className="tagrow">
          {co.verificationLevel === 'L2' ? <span className="badge">✓ Verified Company</span> : <span className="flag">Unverified company</span>}
          {job.outsideFlag && <span className="flag">Outside launch area — fewer local matches</span>}
          {job.clientName && <span className="badge">Posted on behalf of {job.clientName}</span>}
        </div>
        <p style={{ lineHeight: 1.65 }}>{job.description}</p>
        {done ? <div className="card" style={{ background: 'var(--g50)' }}>{done} <Link to="/applications">Track it →</Link></div>
          : <div className="applybar"><button className="btn block" onClick={apply}>Apply in one tap</button></div>}
        {err && <p className="mut">{err}</p>}
      </div>
      <div className="card mut">🔒 Never pay to apply. Iali removes anyone who asks for money, fees or bank details. <Link to="/applications">How tracking works</Link></div>
    </>
  );
}
