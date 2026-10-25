import { Filter, ArrowUpDown } from 'lucide-react';

const STAGES = ['All', 'Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Withdrawn'];

// Pipeline stage filters and applicant sorting in Electric Indigo theme
export default function ApplicantsStageFilter({
  activeStage,
  setActiveStage,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {STAGES.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setActiveStage(st)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeStage === st
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer shadow-2xs"
        >
          <option value="match">Highest Match Score</option>
          <option value="newest">Newest Submission</option>
          <option value="oldest">Oldest Submission</option>
        </select>
      </div>
    </div>
  );
}
