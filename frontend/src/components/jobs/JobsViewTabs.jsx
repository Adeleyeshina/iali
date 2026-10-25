import { Star, Briefcase } from 'lucide-react';
import { useSavedJobs } from '../../context/SavedJobsContext.jsx';

// Tab selection between all live jobs and saved jobs in Electric Indigo theme
export default function JobsViewTabs({
  viewTab,
  onSelectTab,
  savedCount: propSavedCount,
  totalJobsCount,
}) {
  const { savedCount: contextSavedCount } = useSavedJobs();
  const savedCount = propSavedCount !== undefined ? propSavedCount : contextSavedCount;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60 w-fit">
        <button
          type="button"
          onClick={() => onSelectTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            viewTab === 'all'
              ? 'bg-white text-indigo-950 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>All Openings</span>
          {typeof totalJobsCount === 'number' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {totalJobsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('saved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            viewTab === 'saved'
              ? 'bg-white text-indigo-950 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-coral-500 fill-coral-400" />
          <span>Saved Jobs</span>
          {savedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gradient-coral text-white font-bold">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
