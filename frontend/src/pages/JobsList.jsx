import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, CheckCircle2, Star } from 'lucide-react';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import WaitlistBanner from '../components/WaitlistBanner.jsx';
import { api } from '../lib/api.js';

const WORK_MODES = ['', 'onsite', 'hybrid', 'remote'];
const PAGE_SIZE = 10;

// Public and candidate job listings screen
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
  const [viewTab, setViewTab] = useState(searchParams.get('view') === 'saved' ? 'saved' : 'all');
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('iali_saved_jobs') || '[]');
    } catch {
      return [];
    }
  });
  const [savedJobs, setSavedJobs] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const observerTarget = useRef(null);

  const loadSavedJobs = async () => {
    if (savedJobIds.length === 0) {
      setSavedJobs([]);
      return;
    }
    try {
      setLoadingSaved(true);
      const res = await api(`/api/jobs?limit=50&ids=${savedJobIds.join(',')}`);
      setSavedJobs(Array.isArray(res) ? res : res.jobs || []);
    } catch {
      setSavedJobs([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (viewTab === 'saved') {
      loadSavedJobs();
    }
  }, [viewTab, savedJobIds.length]);

  const handleToggleBookmark = (jobId, isNowSaved) => {
    setSavedJobIds((prev) => {
      const next = isNowSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId);
      return next;
    });
    if (!isNowSaved) {
      setSavedJobs((prev) => (prev ? prev.filter((j) => j.id !== jobId) : []));
    }
  };

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
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">Browse jobs</h1>
      <p className="text-sm text-zinc-500 mb-4">
        Lagos & Ibadan for onsite · remote roles nationwide · live feed.
      </p>

      {/* Non-launch city waitlist banner */}
      <WaitlistBanner />

      {/* Search and Filters Box */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs mb-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              placeholder="Title, skill or company…"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              aria-label="Keyword"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              placeholder="City (e.g. Lagos, Ibadan, Remote)"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              aria-label="City"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
            />
          </div>
        </div>

        <button
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs md:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
          onClick={() => handleApplyFilters()}
        >
          <Search className="w-4 h-4" />
          <span>Show matches</span>
        </button>
      </div>

      {/* Work Mode Chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        {WORK_MODES.map((mode) => (
          <button
            key={mode}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer capitalize ${
              filters.workMode === mode
                ? 'bg-zinc-950 text-white border-zinc-950'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            }`}
            onClick={() => handleApplyFilters({ workMode: mode })}
          >
            {mode === '' ? 'All modes' : mode}
          </button>
        ))}
      </div>

      {/* View Tabs: All Jobs vs Saved Jobs */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-2 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewTab('all')}
            className={`text-xs md:text-sm font-bold pb-2 transition cursor-pointer ${
              viewTab === 'all'
                ? 'text-zinc-900 border-b-2 border-zinc-900 -mb-[10px]'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            All Open Roles
          </button>
          <button
            onClick={() => setViewTab('saved')}
            className={`text-xs md:text-sm font-bold pb-2 transition cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'saved'
                ? 'text-zinc-900 border-b-2 border-zinc-900 -mb-[10px]'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${savedJobIds.length > 0 ? 'fill-amber-400 text-amber-500' : 'text-zinc-400'}`} />
            <span>Saved Jobs</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-bold border border-zinc-200">
              {savedJobIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* Saved Jobs View */}
      {viewTab === 'saved' && (
        <div>
          {loadingSaved && (
            <div className="space-y-3">
              <div className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
              <div className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
            </div>
          )}

          {!loadingSaved && (savedJobs || []).map((job) => (
            <JobCard key={job.id} job={job} onToggleBookmark={handleToggleBookmark} />
          ))}

          {!loadingSaved && savedJobs?.length === 0 && (
            <EmptyState
              icon={Star}
              title="No saved jobs yet"
              hint="Click the bookmark star icon on any job card to save roles you want to apply for later."
              action={
                <button
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer"
                  onClick={() => setViewTab('all')}
                >
                  Browse all open roles
                </button>
              }
            />
          )}
        </div>
      )}

      {/* All Jobs View */}
      {viewTab === 'all' && (
        <>
          {/* Skeleton Loading State */}
          {jobs === null && (
            <div className="space-y-3">
              <div className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
              <div className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
              <div className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
            </div>
          )}

          {/* Job Cards */}
          {(jobs || []).map((job) => (
            <JobCard key={job.id} job={job} onToggleBookmark={handleToggleBookmark} />
          ))}

          <div ref={observerTarget} className="h-5" />

          {loadingMore && (
            <div className="text-center py-4">
              <div className="h-12 max-w-sm mx-auto bg-zinc-100 rounded-xl animate-pulse" />
              <p className="text-xs text-zinc-500 mt-2">Loading more jobs…</p>
            </div>
          )}

          {jobs !== null && !hasMore && jobs.length > 0 && (
            <p className="text-center text-xs text-zinc-400 my-6 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              <span>You have reached the end of the jobs feed.</span>
            </p>
          )}

          {jobs?.length === 0 && (
            <EmptyState
              title="No matches yet"
              hint="Switch to remote or widen your filters — new verified roles land daily."
              action={
                <button
                  className="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer"
                  onClick={() => handleApplyFilters({ city: '', workMode: '', q: '' })}
                >
                  Clear filters
                </button>
              }
            />
          )}
        </>
      )}
    </div>
  );
}
