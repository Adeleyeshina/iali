import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
export default function Queues() {
  const [q, setQ] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api('/api/admin/queues').then((d) => { setQ(d); setErr(''); }).catch((e) => setErr(e.message + ' — log in as admin@iali.ng'));
  useEffect(load, []);
  const decide = async (kind, targetId, ok) => { await api('/api/admin/decide', { method: 'POST', body: { kind, targetId, ok, reason: ok ? 'looks good' : 'needs more info' } }); load(); };
  if (err && !q) return <div className="card">🔒 {err}</div>;
  if (!q) return <><div className="sk" /><div className="sk" /></>;
  return (
    <div>
      <h2 style={{ letterSpacing: '-.5px' }}>Trust centre 🛡</h2>
      <p className="mut">Verify companies, review first jobs, watch demand by city.</p>
      <div className="card"><h3 style={{ marginTop: 0 }}>Jobs pending review ({(q.jobs || []).length})</h3>
        {(q.jobs || []).length === 0 ? <p className="mut">Queue clear ✓</p> :
          <table className="t"><thead><tr><th>Role</th><th>Mode</th><th></th></tr></thead><tbody>
            {(q.jobs || []).map((j) => <tr key={j.id}><td><b>{j.title}</b><br /><span className="mut">{j.city || 'Remote'}</span></td><td>{j.workMode}</td>
              <td><button className="btn sm" onClick={() => decide('job', j.id, true)}>Approve</button> <button className="btn sm ghost" onClick={() => decide('job', j.id, false)}>Remove</button></td></tr>)}
          </tbody></table>}
      </div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Verification requests ({(q.verifications || []).length})</h3>
        {(q.verifications || []).length === 0 ? <p className="mut">Nothing waiting ✓</p> :
          (q.verifications || []).map((v) => <div key={v.id} className="mut">{v.type} — {v.userId}</div>)}
      </div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Demand signals</h3>
        <p className="mut">Waitlist + flagged roles per city — open a city when demand justifies it.</p>
        <pre className="dump">{JSON.stringify(q.waitlist, null, 2)}</pre>
      </div>
    </div>
  );
}
