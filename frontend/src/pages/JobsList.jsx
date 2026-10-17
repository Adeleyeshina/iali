import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../lib/api.js';

const WORK_MODES = ['', 'onsite', 'hybrid', 'remote'];
const PAGE_SIZE = 8;

export default function JobsList() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    workMode: '',
    q: searchParams.get('q') || '',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerTarget = useRef(null);

  const fetchJobs = async (pageToFetch, append = false, activeFilters = filters) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setJobs(null);
    }

    try {
      const cleanParams = Object.fromEntries(
        Object.entries(activeFilters).filter(([, value]) => value)
      );

      const queryParams = new URLSearchParams({
        ...cleanParams,
        page: String(pageToFetch),
        limit: String(PAGE_SIZE),
      });

      const response = await api('/api/jobs?' + queryParams);
      const jobList = Array.isArray(response) ? response : response.jobs || [];
      const moreAvailable = response.pagination ? response.pagination.hasMore : jobList.length >= PAGE_SIZE;

      setJobs((prevJobs) => (append ? [...(prevJobs || []), ...jobList] : jobList));
      setHasMore(moreAvailable);
      setPage(pageToFetch);
    } catch {
      if (!append) setJobs([]);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchJobs(1, false);
  }, []);

  const handleApplyFilters = (overrides) => {
    const updated = { ...filters, ...(overrides || {}) };
    setFilters(updated);
    setPage(1);
    fetchJobs(1, false, updated);
  };

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loadingMore && jobs !== null && jobs.length > 0) {
        fetchJobs(page + 1, true);
      }
    },
    [hasMore, loadingMore, page, jobs, filters]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div>
      <h2 style={{ margin: '6px 0 0', letterSpacing: '-0.5px' }}>Browse jobs</h2>
      <p className="mut" style={{ marginTop: 4 }}>
        Lagos + Ibadan for onsite · remote roles nationwide · live infinite feed.
      </p>

      <div className="card" style={{ padding: 12 }}>
        <input
          placeholder="🔍 Title, skill or company…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          aria-label="Keyword"
        />

        <input
          placeholder="City (e.g. Lagos, Ibadan, Enugu)"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          aria-label="City"
        />

        <button className="btn block" onClick={() => handleApplyFilters()}>
          Show matches
        </button>
      </div>

      <div className="filters">
        {WORK_MODES.map((mode) => (
          <button
            key={mode}
            className={'chip' + (filters.workMode === mode ? ' on' : '')}
            onClick={() => handleApplyFilters({ workMode: mode })}
          >
            {mode === '' ? 'All modes' : mode}
          </button>
        ))}
      </div>

      {jobs === null && (
        <>
          <div className="sk" style={{ marginBottom: 12 }} />
          <div className="sk" style={{ marginBottom: 12 }} />
          <div className="sk" style={{ marginBottom: 12 }} />
        </>
      )}

      {(jobs || []).map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      <div ref={observerTarget} style={{ height: 20 }} />

      {loadingMore && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div className="sk" style={{ height: 48, maxWidth: 400, margin: '0 auto' }} />
          <p className="mut" style={{ marginTop: 8 }}>
            Loading more jobs…
          </p>
        </div>
      )}

      {jobs !== null && !hasMore && jobs.length > 0 && (
        <p className="mut" style={{ textAlign: 'center', margin: '24px 0' }}>
          ✓ You've reached the end of the jobs feed.
        </p>
      )}

      {jobs?.length === 0 && (
        <EmptyState
          title="No matches yet"
          hint="Switch to remote or widen your filters — new verified roles land daily."
          action={
            <button
              className="btn ghost"
              onClick={() => handleApplyFilters({ city: '', workMode: '', q: '' })}
            >
              Clear filters
            </button>
          }
        />
      )}
    </div>
  );
}
