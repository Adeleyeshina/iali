import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/EmptyState.jsx';
import { api } from '../../lib/api.js';

const STAGES = ['Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Hired'];

export default function Applications() {
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    api('/api/applications/mine')
      .then((data) => setApplications(data))
      .catch(() => setApplications([]));
  }, []);

  if (!applications) {
    return (
      <>
        <div className="sk" />
        <div className="sk" />
      </>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon="📄"
        title="No applications yet"
        hint="One tap applies with your saved profile. Track every stage here."
        action={
          <Link className="btn" to="/jobs">
            Find roles →
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h2 style={{ letterSpacing: '-0.5px' }}>My applications</h2>

      {applications.map((application) => {
        const currentStageIndex = STAGES.indexOf(application.status);

        return (
          <div className="card" key={application.id}>
            <b>Role {application.jobId.slice(0, 8)}…</b>

            <div className="tagrow">
              <span className="badge">
                {application.rejected ? 'Rejected' : application.status}
              </span>
              <span className="mut">
                {new Date(application.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="steps" style={{ marginTop: 12 }}>
              {STAGES.map((stageName, index) => {
                const isPassed = currentStageIndex >= 0 && index <= currentStageIndex;
                return (
                  <span
                    key={stageName}
                    title={stageName}
                    className={`step ${isPassed ? 'on' : ''}`}
                  />
                );
              })}
            </div>

            <p className="mut" style={{ margin: '4px 0 0' }}>
              {application.status === 'Submitted'
                ? 'Sent — recruiter hasn’t opened it yet.'
                : `Stage: ${application.status}. You’ll get an email on every change.`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
