import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import { api } from '../lib/api.js';

export default function Home() {
  const [jobs, setJobs] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api('/api/jobs?limit=4')
      .then((res) => {
        const list = Array.isArray(res) ? res : res.jobs || [];
        setJobs(list.slice(0, 4));
      })
      .catch(() => setJobs([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <section className="hero">
        <h1>
          Get hired. Hire free.
          <br />
          No wahala.
        </h1>
        <p>
          Nigeria's free two-way hiring app on the web. Candidates get found with a 2-minute CV profile.
          Verified companies post jobs, search talent and message direct — no fees, no scams.
        </p>

        <div className="hero-cta">
          <Link className="btn light" to="/jobs">
            Find a job
          </Link>
          <Link className="btn dark" to="/signup">
            Hire talent →
          </Link>
        </div>

        <form className="searchbar" onSubmit={handleSearch}>
          <input
            placeholder="Try ‘React’, ‘Lagos’, ‘remote’…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search jobs"
          />
          <button className="btn" type="submit">
            Search
          </button>
        </form>

        <div className="stats">
          <div className="stat">
            <b>2 min</b>
            <span>CV → profile</span>
          </div>
          <div className="stat">
            <b>₦0</b>
            <span>post · apply · hire</span>
          </div>
          <div className="stat">
            <b>✓ Verified</b>
            <span>companies only</span>
          </div>
        </div>
      </section>

      <div className="sect">
        <h2>Fresh roles</h2>
        <Link to="/jobs">See all →</Link>
      </div>

      {!jobs && (
        <>
          <div className="sk" />
          <div className="sk" />
        </>
      )}

      {(jobs || []).map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      {jobs?.length === 0 && (
        <div className="card mut">No live roles yet — be the first company to post.</div>
      )}

      <div className="sect">
        <h2>How it works</h2>
      </div>

      <div className="grid2">
        <div className="card">
          <b>📄 1. Drop your CV</b>
          <p className="mut">Paste your CV text, review the auto-filled profile, save. Done in under two minutes.</p>
        </div>
        <div className="card">
          <b>🔍 2. Get found</b>
          <p className="mut">Verified recruiters search Lagos, Ibadan and remote talent — and message you inside Iali.</p>
        </div>
        <div className="card">
          <b>✓ 3. Trust every badge</b>
          <p className="mut">Verified Company ticks and professional HR ticks. First jobs reviewed. Scammers removed.</p>
        </div>
        <div className="card">
          <b>📄 4. Track everything</b>
          <p className="mut">One-tap apply, live status from Submitted to Offer. No more guessing.</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <b>Recruiting in Lagos or Ibadan?</b>
          <p className="mut" style={{ margin: '4px 0 0' }}>
            Post your first role free — it goes live after a quick review.
          </p>
        </div>
        <Link className="btn" to="/signup">
          Post a job free
        </Link>
      </div>
    </>
  );
}
