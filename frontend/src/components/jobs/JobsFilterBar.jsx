import { Search } from 'lucide-react';
import { NIGERIAN_CITIES } from '../../data/launchAreas.js';

const WORK_MODES = ['', 'onsite', 'hybrid', 'remote'];

// Search input, location dropdown, and work mode filters for job listings
export default function JobsFilterBar({
  filters,
  onChangeFilter,
  onSubmitSearch,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs mb-5">
      <form onSubmit={onSubmitSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, role or tech stack (e.g. React, Python)…"
            value={filters.q || ''}
            onChange={(e) => onChangeFilter('q', e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition shadow-2xs"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={filters.city || ''}
            onChange={(e) => onChangeFilter('city', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition cursor-pointer shadow-2xs"
          >
            <option value="">All Nigerian Locations</option>
            {NIGERIAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={filters.workMode || ''}
            onChange={(e) => onChangeFilter('workMode', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition cursor-pointer capitalize shadow-2xs"
          >
            <option value="">All Work Modes</option>
            {WORK_MODES.filter(Boolean).map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
