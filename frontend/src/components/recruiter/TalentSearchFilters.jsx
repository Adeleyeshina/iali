import { Search, Filter } from 'lucide-react';

// Search input, status filter pills, and completeness filter for talent discovery
export default function TalentSearchFilters({
  searchQuery,
  setSearchQuery,
  onSearch,
  statusFilter,
  setStatusFilter,
  completeOnly,
  setCompleteOnly,
  searching,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs mb-5 space-y-3.5">
      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role headline, or skill (e.g. React, Python, Product Designer)…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-5 py-2.5 rounded-xl bg-indigo-950 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'active', label: 'Actively Looking' },
            { id: 'open', label: 'Open to Offers' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer shrink-0 font-medium">
          <input
            type="checkbox"
            checked={completeOnly}
            onChange={(e) => setCompleteOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <span>100% Complete Profiles only</span>
        </label>
      </div>
    </div>
  );
}
