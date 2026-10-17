import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { LAUNCH } from '../../data/launchAreas.js';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/api/profile')
      .then((data) => setProfile(data))
      .catch(() => setProfile({}));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api('/api/profile', { method: 'PUT', body: profile });
      setStatusMessage('Saved ✓ ' + new Date().toLocaleTimeString());
    } catch (err) {
      setStatusMessage(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="sk" />;
  }

  const profileStrength = [
    profile.headline,
    profile.city,
    (profile.skills || []).length > 0,
  ].filter(Boolean).length;

  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>My profile 👤</h2>
      <p className="mut">
        Profile strength: {profileStrength}/3 ·{' '}
        {profile.searchable === false ? 'Hidden from search 🔒' : 'Visible to verified recruiters ✓'}
      </p>

      <label className="lbl">Headline</label>
      <input
        placeholder="e.g. Frontend developer · React · Lagos"
        value={profile.headline || ''}
        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
      />

      <label className="lbl">Skills (comma separated)</label>
      <input
        placeholder="React, JavaScript, CSS"
        value={(profile.skills || []).join(', ')}
        onChange={(e) =>
          setProfile({
            ...profile,
            skills: e.target.value
              .split(',')
              .map((skill) => skill.trim())
              .filter(Boolean),
          })
        }
      />

      <div className="grid2">
        <div>
          <label className="lbl">City</label>
          <select
            value={profile.city || ''}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          >
            <option value="">Choose…</option>
            {LAUNCH.map((launchCity) => (
              <option key={launchCity.city} value={launchCity.city}>
                {launchCity.city}
              </option>
            ))}
            <option value="Enugu">Enugu (waitlist)</option>
            <option value="Abuja">Abuja (waitlist)</option>
          </select>
        </div>

        <div>
          <label className="lbl">Work mode</label>
          <select
            value={profile.workModePref || 'remote'}
            onChange={(e) => setProfile({ ...profile, workModePref: e.target.value })}
          >
            <option value="onsite">onsite</option>
            <option value="hybrid">hybrid</option>
            <option value="remote">remote</option>
          </select>
        </div>
      </div>

      <div className="grid2">
        <div>
          <label className="lbl">Availability</label>
          <select
            value={profile.availability || 'Actively looking'}
            onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
          >
            <option value="Actively looking">Actively looking</option>
            <option value="Open to offers">Open to offers</option>
            <option value="Not looking">Not looking</option>
          </select>
        </div>

        <div>
          <label className="lbl">Who can message me</label>
          <select
            value={profile.contactPref || 'any'}
            onChange={(e) => setProfile({ ...profile, contactPref: e.target.value })}
          >
            <option value="any">Any verified recruiter</option>
            <option value="approved">Approved only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0' }}>
        <input
          type="checkbox"
          style={{ width: 'auto' }}
          checked={Boolean(profile.willingRelocate)}
          onChange={(e) => setProfile({ ...profile, willingRelocate: e.target.checked })}
        />
        Open to relocate
      </label>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0 12px' }}>
        <input
          type="checkbox"
          style={{ width: 'auto' }}
          checked={profile.searchable !== false}
          onChange={(e) => setProfile({ ...profile, searchable: e.target.checked })}
        />
        Show me in recruiter search
      </label>

      <button className="btn block" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving profile…' : 'Save profile'}
      </button>

      {statusMessage && <p className="badge">{statusMessage}</p>}
    </div>
  );
}
