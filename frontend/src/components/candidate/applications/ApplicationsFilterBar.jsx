import { Filter, ArrowUpDown, Star, FileText } from 'lucide-react';
import { useSavedJobs } from '../../../context/SavedJobsContext.jsx';

const STATUS_FILTERS = [
  'All',
  'Submitted',
  'Viewed',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
  'Withdrawn',
];

// Status filters, sort order, and tab selection for applications
export default function ApplicationsFilterBar({
  activeTab,
  onSwitchTab,
  applicationsCount,
  savedCount: propSavedCount,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) {
  const { savedCount: contextSavedCount } = useSavedJobs();
  const savedCount = propSavedCount !== undefined ? propSavedCount : contextSavedCount;
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs mb-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
          <button
            type="button"
            onClick={() => onSwitchTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'bg-white text-indigo-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>My Applications</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold">
              {applicationsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-white text-indigo-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>Saved Jobs</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'applications' && (
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'applications' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
