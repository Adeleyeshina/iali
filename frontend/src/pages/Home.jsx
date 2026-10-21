import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import CvDropModal from '../components/CvDropModal.jsx';
import { api } from '../lib/api.js';

export default function Home({ user }) {
  const [jobs, setJobs] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
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
          <button
            type="button"
            className="btn dark"
            onClick={() => setIsCvModalOpen(true)}
          >
            📄 Auto-build profile from CV
          </button>
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
          <div
            className="stat"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsCvModalOpen(true)}
            title="Click to drop CV"
          >
            <b>2 min ⚡</b>
            <span>CV → profile (Try it)</span>
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
        <div
          className="card actionable"
          onClick={() => setIsCvModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsCvModalOpen(true)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>📄 1. Drop your CV</b>
            <span className="badge">Try it now</span>
          </div>
          <p className="mut" style={{ margin: '8px 0 12px' }}>
            Drop your PDF or paste text. We auto-extract your skills, experience, and title in seconds.
          </p>
          <button
            type="button"
            className="btn sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsCvModalOpen(true);
            }}
          >
            Drop or Paste CV →
          </button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>🔍 2. Get found</b>
            <span className="badge">Active</span>
          </div>
          <p className="mut" style={{ margin: '8px 0 12px' }}>
            Verified recruiters search Lagos, Ibadan and remote talent — and message you inside Iali.
          </p>
          <Link
            className="btn sm ghost"
            to={user?.role === 'recruiter' ? '/search' : '/jobs'}
          >
            {user?.role === 'recruiter' ? 'Search candidates →' : 'See live roles →'}
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>✓ 3. Trust every badge</b>
            <span className="badge">Verified only</span>
          </div>
          <p className="mut" style={{ margin: '8px 0 12px' }}>
            Verified Company ticks and professional HR ticks. First jobs reviewed. Scammers removed.
          </p>
          <span className="mut" style={{ fontSize: 13, display: 'inline-block' }}>
            🛡 Zero fees for job seekers. Zero commission.
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>📋 4. Track everything</b>
            <span className="badge">Live</span>
          </div>
          <p className="mut" style={{ margin: '8px 0 12px' }}>
            One-tap apply, live status from Submitted to Offer. No more guessing.
          </p>
          <Link
            className="btn sm ghost"
            to={user ? '/applications' : '/jobs'}
          >
            {user ? 'My Applications →' : 'Browse & Apply →'}
          </Link>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <b>Recruiting in Lagos or Ibadan?</b>
          <p className="mut" style={{ margin: '4px 0 0' }}>
            Post your first role free — it goes live after a quick review.
          </p>
        </div>
        <Link className="btn" to="/post-job">
          Post a job free
        </Link>
      </div>

      <CvDropModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        user={user}
      />
    </>
  );
}
