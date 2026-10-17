import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initials } from '../components/JobCard.jsx';
import { api } from '../lib/api.js';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api(`/api/jobs/${id}`)
      .then((data) => setJob(data))
      .catch((err) => setErrorMessage(err.message));
  }, [id]);

  const handleApplyJob = async () => {
    if (applying) return;
    setApplying(true);
    setErrorMessage('');

    try {
      const response = await api(`/api/jobs/${id}/apply`, {
        method: 'POST',
        body: {},
      });
      setSuccessMessage('Application sent ✓' + (response.notice ? ` — ${response.notice}` : ''));
    } catch (err) {
      setErrorMessage(err.message + ' — candidates: log in first.');
    } finally {
      setApplying(false);
    }
  };

  if (errorMessage && !job) {
    return (
      <div className="card">
        {errorMessage} <Link to="/jobs">← Back to jobs</Link>
      </div>
    );
  }

  if (!job) {
    return <div className="sk" />;
  }

  const company = job.company || {};

  return (
    <>
      <Link to="/jobs" className="mut" style={{ textDecoration: 'none', fontWeight: 700 }}>
        ← All jobs
      </Link>

      <div className="card">
        <div className="comp-hdr">
          <span className="avatar" style={{ width: 56, height: 56 }}>
            {initials(company.name)}
          </span>
          <div>
            <h2 style={{ margin: 0, letterSpacing: '-0.5px' }}>{job.title}</h2>
            <div className="mut">
              {company.name} · {job.workMode} · {job.city || 'Remote · Nigeria'}
            </div>
          </div>
        </div>

        <div className="tagrow">
          {company.verificationLevel === 'L2' ? (
            <span className="badge">✓ Verified Company</span>
          ) : (
            <span className="flag">Unverified company</span>
          )}
          {job.outsideFlag && <span className="flag">Outside launch area — fewer local matches</span>}
          {job.clientName && <span className="badge">Posted on behalf of {job.clientName}</span>}
        </div>

        <p style={{ lineHeight: 1.65 }}>{job.description}</p>

        {successMessage ? (
          <div className="card" style={{ background: 'var(--g50)' }}>
            {successMessage} <Link to="/applications">Track it →</Link>
          </div>
        ) : (
          <div className="applybar">
            <button
              className="btn block"
              onClick={handleApplyJob}
              disabled={applying}
            >
              {applying ? 'Submitting application…' : 'Apply in one tap'}
            </button>
          </div>
        )}

        {errorMessage && <p className="mut">{errorMessage}</p>}
      </div>

      <div className="card mut">
        🔒 Never pay to apply. Iali removes anyone who asks for money, fees or bank details.{' '}
        <Link to="/applications">How tracking works</Link>
      </div>
    </>
  );
}
