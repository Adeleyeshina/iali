import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { LAUNCH } from '../../data/launchAreas.js';
export default function Profile() {
  const [p, setP] = useState(null);
  const [ok, setOk] = useState('');
  useEffect(() => { api('/api/profile').then(setP).catch(() => setP({})); }, []);
  const save = async () => { await api('/api/profile', { method: 'PUT', body: p }); setOk('Saved ✓ ' + new Date().toLocaleTimeString()); };
  if (!p) return <div className="sk" />;
  const complete = [p.headline, p.city, (p.skills || []).length].filter(Boolean).length;
  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>My profile 👤</h2>
      <p className="mut">Profile strength: {complete}/3 · {p.searchable === false ? 'Hidden from search 🔒' : 'Visible to verified recruiters ✓'}</p>
      <label className="lbl">Headline</label>
      <input placeholder="e.g. Frontend developer · React · Lagos" value={p.headline || ''} onChange={(e) => setP({ ...p, headline: e.target.value })} />
      <label className="lbl">Skills (comma separated)</label>
      <input placeholder="React, JavaScript, CSS" value={(p.skills || []).join(', ')} onChange={(e) => setP({ ...p, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
      <div className="grid2">
        <div><label className="lbl">City</label>
          <select value={p.city || ''} onChange={(e) => setP({ ...p, city: e.target.value })}><option value="">Choose…</option>{LAUNCH.map((l) => <option key={l.city} value={l.city}>{l.city}</option>)}<option value="Enugu">Enugu (waitlist)</option><option value="Abuja">Abuja (waitlist)</option></select></div>
        <div><label className="lbl">Work mode</label>
          <select value={p.workModePref || 'remote'} onChange={(e) => setP({ ...p, workModePref: e.target.value })}><option>onsite</option><option>hybrid</option><option>remote</option></select></div>
      </div>
      <div className="grid2">
        <div><label className="lbl">Availability</label>
          <select value={p.availability || 'Actively looking'} onChange={(e) => setP({ ...p, availability: e.target.value })}><option>Actively looking</option><option>Open to offers</option><option>Not looking</option></select></div>
        <div><label className="lbl">Who can message me</label>
          <select value={p.contactPref || 'any'} onChange={(e) => setP({ ...p, contactPref: e.target.value })}><option value="any">Any verified recruiter</option><option value="approved">Approved only</option><option value="nobody">Nobody</option></select></div>
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0' }}><input type="checkbox" style={{ width: 'auto' }} checked={!!p.willingRelocate} onChange={(e) => setP({ ...p, willingRelocate: e.target.checked })} /> Open to relocate</label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0 12px' }}><input type="checkbox" style={{ width: 'auto' }} checked={p.searchable !== false} onChange={(e) => setP({ ...p, searchable: e.target.checked })} /> Show me in recruiter search</label>
      <button className="btn block" onClick={save}>Save profile</button>
      {ok && <p className="badge">{ok}</p>}
    </div>
  );
}
