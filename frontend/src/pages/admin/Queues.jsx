import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function Queues() {
  const [queuesData, setQueuesData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [decidingId, setDecidingId] = useState(null);

  const fetchQueues = () =>
    api('/api/admin/queues')
      .then((data) => {
        setQueuesData(data);
        setErrorMessage('');
      })
      .catch((err) => {
        setErrorMessage(err.message + ' — log in as admin@iali.ng');
      });

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleReviewDecision = async (kind, targetId, isApproved) => {
    try {
      setDecidingId(targetId);
      await api('/api/admin/decide', {
        method: 'POST',
        body: {
          kind,
          targetId,
          ok: isApproved,
          reason: isApproved ? 'looks good' : 'needs more info',
        },
      });
      await fetchQueues();
    } catch (err) {
      alert(err.message);
    } finally {
      setDecidingId(null);
    }
  };

  if (errorMessage && !queuesData) {
    return <div className="card">🔒 {errorMessage}</div>;
  }

  if (!queuesData) {
    return (
      <>
        <div className="sk" />
        <div className="sk" />
      </>
    );
  }

  const pendingJobs = queuesData.jobs || [];
  const pendingVerifications = queuesData.verifications || [];

  return (
    <div>
      <h2 style={{ letterSpacing: '-0.5px' }}>Trust centre 🛡</h2>
      <p className="mut">Verify companies, review first jobs, watch demand by city.</p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Jobs pending review ({pendingJobs.length})</h3>

        {pendingJobs.length === 0 ? (
          <p className="mut">Queue clear ✓</p>
        ) : (
          <table className="t">
            <thead>
              <tr>
                <th>Role</th>
                <th>Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingJobs.map((jobItem) => (
                <tr key={jobItem.id}>
                  <td>
                    <b>{jobItem.title}</b>
                    <br />
                    <span className="mut">{jobItem.city || 'Remote'}</span>
                  </td>
                  <td>{jobItem.workMode}</td>
                  <td>
                    <button
                      className="btn sm"
                      onClick={() => handleReviewDecision('job', jobItem.id, true)}
                      disabled={decidingId === jobItem.id}
                    >
                      {decidingId === jobItem.id ? 'Updating…' : 'Approve'}
                    </button>{' '}
                    <button
                      className="btn sm ghost"
                      onClick={() => handleReviewDecision('job', jobItem.id, false)}
                      disabled={decidingId === jobItem.id}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Verification requests ({pendingVerifications.length})</h3>

        {pendingVerifications.length === 0 ? (
          <p className="mut">Nothing waiting ✓</p>
        ) : (
          pendingVerifications.map((verificationItem) => (
            <div key={verificationItem.id} className="mut">
              {verificationItem.type} — {verificationItem.userId}
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Demand signals</h3>
        <p className="mut">Waitlist + flagged roles per city — open a city when demand justifies it.</p>
        <pre className="dump">{JSON.stringify(queuesData.waitlist, null, 2)}</pre>
      </div>
    </div>
  );
}
