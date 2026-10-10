import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/EmptyState.jsx';
import { api } from '../../lib/api.js';
const STAGES = ['Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Hired'];
export default function Applications() {
  const [apps, setApps] = useState(null);
  useEffect(() => { api('/api/applications/mine').then(setApps).catch(() => setApps([])); }, []);
  if (!apps) return <><div className="sk" /><div className="sk" /></>;
  if (!apps.length) return <EmptyState icon="📄" title="No applications yet" hint="One tap applies with your saved profile. Track every stage here." action={<Link className="btn" to="/jobs">Find roles →</Link>} />;
  return (
    <div>
      <h2 style={{ letterSpacing: '-.5px' }}>My applications</h2>
      {apps.map((a) => {
        const idx = STAGES.indexOf(a.status);
        return (
          <div className="card" key={a.id}>
            <b>Role {a.jobId.slice(0, 8)}…</b>
            <div className="tagrow"><span className="badge">{a.rejected ? 'Rejected' : a.status}</span><span className="mut">{new Date(a.createdAt).toLocaleDateString()}</span></div>
            <div className="steps" style={{ marginTop: 12 }}>{STAGES.map((s, i) => <span key={s} title={s} className={`step ${idx >= 0 && i <= idx ? 'on' : ''}`} />)}</div>
            <p className="mut" style={{ margin: '4px 0 0' }}>{a.status === 'Submitted' ? 'Sent — recruiter hasn’t opened it yet.' : `Stage: ${a.status}. You’ll get an email on every change.`}</p>
          </div>
        );
      })}
    </div>
  );
}
