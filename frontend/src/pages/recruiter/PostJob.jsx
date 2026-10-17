import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { LAUNCH } from '../../data/launchAreas.js';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workMode: 'onsite',
    city: 'Lagos',
    clientName: '',
  });
  const [createdJob, setCreatedJob] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleCreateJob = async () => {
    if (posting) return;
    setPosting(true);

    try {
      setErrorMessage('');
      const response = await api('/api/jobs', {
        method: 'POST',
        body: formData,
      });
      setCreatedJob(response);
    } catch (err) {
      setErrorMessage(err.message + ' — log in as a recruiter in a company first.');
    } finally {
      setPosting(false);
    }
  };

  const handleSwitchToRemote = async () => {
    if (switching || !createdJob) return;
    setSwitching(true);

    try {
      const updatedJob = await api(`/api/jobs/${createdJob.id}/to-remote`, {
        method: 'PATCH',
        body: {},
      });
      setCreatedJob({ ...createdJob, ...updatedJob, notice: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>Post a job 💼</h2>
      <p className="mut">Free forever in this release · first post reviewed before going live.</p>

      <div className="steps">
        <span className="step on" />
        <span className={`step ${formData.title && formData.description ? 'on' : ''}`} />
        <span className={`step ${createdJob ? 'on' : ''}`} />
      </div>

      <label className="lbl">Role title</label>
      <input
        placeholder="e.g. Frontend Developer"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        disabled={posting}
      />

      <label className="lbl">What will they do?</label>
      <textarea
        rows="4"
        placeholder="Stack, responsibilities, salary range (optional)…"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        disabled={posting}
      />

      <div className="grid2">
        <div>
          <label className="lbl">Work mode</label>
          <select
            value={formData.workMode}
            onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
            disabled={posting}
          >
            <option value="onsite">onsite</option>
            <option value="hybrid">hybrid</option>
            <option value="remote">remote</option>
          </select>
        </div>

        {formData.workMode !== 'remote' && (
          <div>
            <label className="lbl">City (dropdown — no free text)</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={posting}
            >
              {LAUNCH.map((launchCity) => (
                <option key={launchCity.city} value={launchCity.city}>
                  {launchCity.city}
                </option>
              ))}
              <option value="Enugu">Enugu</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>
          </div>
        )}
      </div>

      <label className="lbl">Agency? Client name (shown as “posted on behalf of…”)</label>
      <input
        placeholder="Optional"
        value={formData.clientName}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        disabled={posting}
      />

      {errorMessage && <p className="flag">{errorMessage}</p>}

      <button
        className="btn block"
        onClick={handleCreateJob}
        disabled={posting || !formData.title.trim() || !formData.description.trim()}
      >
        {posting ? 'Publishing role…' : 'Publish role →'}
      </button>

      {createdJob && (
        <div className="card" style={{ background: 'var(--g50)' }}>
          <b>✓ Saved as {createdJob.status}</b>
          {createdJob.notice ? (
            <>
              <p className="mut">{createdJob.notice}</p>
              <button
                className="btn ghost"
                onClick={handleSwitchToRemote}
                disabled={switching}
              >
                {switching ? 'Updating to remote…' : 'Switch to remote — reach all Nigeria'}
              </button>
            </>
          ) : (
            <p className="mut">
              Live and ranking in the feed. <Link to={`/jobs/${createdJob.id}`}>View it →</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
