import { User } from 'lucide-react';
import { NIGERIAN_CITIES } from '../../../data/launchAreas.js';

// Basic profile details and target headline
export default function BasicInfoSection({ profile, setProfile, breakdown, sectionRef }) {
  return (
    <div className="space-y-4" ref={sectionRef}>
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5 min-w-0">
          <User className="w-4 h-4 text-zinc-500 shrink-0" />
          <span className="truncate">1. Basic Info & Target Role</span>
        </span>
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 shrink-0">
          {breakdown?.basicInfo ?? 0} / 15%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name
          </label>
          <input
            placeholder="e.g. Adaeze Okonkwo"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Target Role / Headline
          </label>
          <input
            placeholder="e.g. Frontend Developer · React"
            value={profile.headline || ''}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            State / Location
          </label>
          <select
            value={profile.city || ''}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer shadow-xs"
          >
            <option value="">Choose city or state…</option>
            {NIGERIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Preferred Work Mode
          </label>
          <select
            value={profile.workModePref || 'remote'}
            onChange={(e) => setProfile({ ...profile, workModePref: e.target.value })}
            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer capitalize shadow-xs"
          >
            <option value="remote">remote</option>
            <option value="hybrid">hybrid</option>
            <option value="onsite">onsite</option>
          </select>
        </div>
      </div>
    </div>
  );
}
