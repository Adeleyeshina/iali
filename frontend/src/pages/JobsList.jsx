import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import WaitlistBanner from '../components/WaitlistBanner.jsx';
import JobsFilterBar from '../components/jobs/JobsFilterBar.jsx';
import JobsViewTabs from '../components/jobs/JobsViewTabs.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSavedJobs } from '../context/SavedJobsContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { api } from '../lib/api.js';

const PAGE_SIZE = 10;

// Public and candidate job listings screen with infinite scroll
export default function JobsList() {
  const { user } = useAuth();
  const { savedJobs, loadingSaved, loadSavedJobs } = useSavedJobs();

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
  const [viewTab, setViewTab] = useState(searchParams.get('view') === 'saved' ? 'saved' : 'all');

  const observerTarget = useRef(null);

  useEffect(() => {
    if (viewTab === 'saved') {
      loadSavedJobs();
    }
  }, [viewTab, loadSavedJobs]);

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

  const debouncedSearchTerm = useDebounce(filters.q, 350);

  useEffect(() => {
    fetchJobs(1, false, { ...filters, q: debouncedSearchTerm });
  }, [debouncedSearchTerm, filters.city, filters.workMode]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchJobs(1, false, { ...filters, q: filters.q });
  };

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loadingMore && jobs && jobs.length > 0) {
        fetchJobs(page + 1, true);
      }
    },
    [hasMore, loadingMore, page, jobs, filters]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const displayedJobs = useMemo(() => {
    return viewTab === 'saved' ? savedJobs : jobs;
  }, [viewTab, savedJobs, jobs]);

  return (
    <div className="max-w-[1120px] mx-auto my-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">Browse Tech Jobs</h1>
        <p className="text-xs md:text-sm text-zinc-500">
          Curated roles with algorithmic match scores and direct employer connections.
        </p>
      </div>

      <JobsFilterBar
        filters={filters}
        onChangeFilter={handleFilterChange}
        onSubmitSearch={handleSearchSubmit}
      />

      <WaitlistBanner city={filters.city} />

      <JobsViewTabs
        viewTab={viewTab}
        onSelectTab={setViewTab}
        totalJobsCount={Array.isArray(jobs) ? jobs.length : undefined}
      />

      {loadingSaved ? (
        <div className="space-y-3">
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      ) : !displayedJobs ? (
        <div className="space-y-3">
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      ) : displayedJobs.length === 0 ? (
        <EmptyState
          title={viewTab === 'saved' ? 'No saved jobs' : 'No jobs found'}
          description={
            viewTab === 'saved'
              ? 'Click the bookmark icon on any job to save it for quick review.'
              : 'Try clearing some filters or searching for a different skill or city.'
          }
        />
      ) : (
        <div className="space-y-3">
          {displayedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}

          {viewTab === 'all' && (
            <div ref={observerTarget} className="py-4 text-center">
              {loadingMore && <div className="text-xs text-zinc-400">Loading more jobs…</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
