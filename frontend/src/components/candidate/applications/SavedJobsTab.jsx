import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import JobCard from '../../JobCard.jsx';
import { useSavedJobs } from '../../../context/SavedJobsContext.jsx';

// Saved jobs list tab content
export default function SavedJobsTab({
  savedJobs: propSavedJobs,
  loadingSaved: propLoadingSaved,
}) {
  const { savedJobs: contextSavedJobs, loadingSaved: contextLoadingSaved, loadSavedJobs } = useSavedJobs();
  const savedJobs = propSavedJobs !== undefined ? propSavedJobs : contextSavedJobs;
  const loadingSaved = propLoadingSaved !== undefined ? propLoadingSaved : contextLoadingSaved;

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);
  if (loadingSaved) {
    return (
      <div className="space-y-3">
        <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
        <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No saved jobs yet</h3>
        <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
          Click the star icon on any job card to save it here for quick review and applying later.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20"
        >
          <span>Explore Open Roles</span>
          <ArrowRight className="w-3.5 h-3.5 text-coral-300" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {savedJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
