import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../lib/api.js';

const MODES = ['', 'onsite', 'hybrid', 'remote'];
export default function JobsList() {
  const [sp] = useSearchParams();
  const [jobs, setJobs] = useState(null);
  const [f, setF] = useState({ city: '', workMode: '', q: sp.get('q') || '' });
  const load = (over) => {
    const cur = { ...f, ...(over || {}) };
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(cur).filter(([, v]) => v)));
    setJobs(null);
    api('/api/jobs?' + qs).then(setJobs).catch(() => setJobs([]));
  };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <h2 style={{ margin: '6px 0 0', letterSpacing: '-.5px' }}>Browse jobs</h2>
      <p className="mut" style={{ marginTop: 4 }}>Lagos + Ibadan for onsite · remote roles nationwide · flagged where thin.</p>
      <div className="card" style={{ padding: 12 }}>
        <input placeholder="🔍 Title, skill or company…" value={f.q} onChange={(e) => { setF({ ...f, q: e.target.value }); }} onKeyDown={(e) => e.key === 'Enter' && load()} aria-label="Keyword" />
        <input placeholder="City (e.g. Lagos, Ibadan, Enugu)" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && load()} aria-label="City" />
        <button className="btn block" onClick={() => load()}>Show matches</button>
      </div>
      <div className="filters">
        {MODES.map((m) => <button key={m} className={'chip' + ((f.workMode === m) ? ' on' : '')} onClick={() => { const v = { ...f, workMode: m }; setF(v); load(v); }}>{m === '' ? 'All modes' : m}</button>)}
      </div>
      {!jobs && <><div className="sk" /><div className="sk" /><div className="sk" /></>}
      {(jobs || []).map((j) => <JobCard key={j.id} job={j} />)}
      {jobs?.length === 0 && <EmptyState title="No matches yet" hint="Switch to remote or widen your filters — new verified roles land daily." action={<button className="btn ghost" onClick={() => { const v = { city: '', workMode: '', q: '' }; setF(v); load(v); }}>Clear filters</button>} />}
    </div>
  );
}
