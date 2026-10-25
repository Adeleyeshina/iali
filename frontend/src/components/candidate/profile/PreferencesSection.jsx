import { Check, CheckCircle2 } from 'lucide-react';

// Talent search preferences, privacy toggles, and profile save action
export default function PreferencesSection({
  profile,
  setProfile,
  saving,
  onSave,
  statusMessage,
}) {
  return (
    <>
      <div className="space-y-3 pt-3 border-t border-zinc-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
          Preferences & Talent Search Visibility
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Employment / Search Status</label>
            <select
              value={profile.availability || 'Actively looking for a job'}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 cursor-pointer shadow-xs"
            >
              <option value="Actively looking for a job">Actively looking for a job</option>
              <option value="Employed, but open to opportunities">Employed, open to opportunities</option>
              <option value="Employed, not looking">Employed, not looking</option>
              <option value="Just exploring / curious">Just exploring / curious</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Who can message me</label>
            <select
              value={profile.contactPref || 'any'}
              onChange={(e) => setProfile({ ...profile, contactPref: e.target.value })}
              className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 cursor-pointer shadow-xs"
            >
              <option value="any">Any verified recruiter</option>
              <option value="approved">Approved only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(profile.willingRelocate)}
              onChange={(e) => setProfile({ ...profile, willingRelocate: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span>Open to relocate for onsite/hybrid roles</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.searchable !== false}
              onChange={(e) => setProfile({ ...profile, searchable: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span>Show me in recruiter talent search</span>
          </label>
        </div>
      </div>

      <div className="pt-2">
        <button
          className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-sm font-bold transition shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          onClick={onSave}
          disabled={saving}
        >
          <Check className="w-4 h-4 text-coral-300" />
          <span>{saving ? 'Saving profile changes…' : 'Save profile'}</span>
        </button>

        {statusMessage && (
          <p className="mt-3 flex sm:inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </p>
        )}
      </div>
    </>
  );
}
