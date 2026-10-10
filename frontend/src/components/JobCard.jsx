import { Link } from 'react-router-dom';
export function initials(name) {
  return String(name || '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
export default function JobCard({ job }) {
  const co = job.company || {};
  return (
    <Link to={`/jobs/${job.id}`} className="card job">
      <span className="avatar">{initials(co.name)}</span>
      <span style={{ flex: 1 }}>
        <h3>{job.title}</h3>
        <span className="meta">{job.workMode} · {job.city || 'Remote · Nigeria'} · {co.name}</span>
        <span className="tagrow">
          {co.verificationLevel === 'L2' && <span className="badge">✓ Verified Company</span>}
          {job.outsideFlag && <span className="flag">Outside launch area</span>}
          {job.clientName && <span className="badge">for {job.clientName}</span>}
        </span>
      </span>
    </Link>
  );
}
