import { Briefcase, Plus, Trash2 } from 'lucide-react';

// Work experience items with add and remove handlers
export default function ExperienceSection({
  experiences,
  addExperience,
  updateExperience,
  removeExperience,
  breakdown,
  sectionRef,
}) {
  return (
    <div className="space-y-3" ref={sectionRef}>
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-zinc-500" />
          <span>3. Work Experience (at least 1 entry) (20%)</span>
        </span>
        <span className="text-[11px] font-bold text-zinc-400">
          {breakdown?.experience ?? 0} / 20%
        </span>
      </div>

      {experiences.length === 0 ? (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-2">No work experience listed yet.</p>
          <button
            type="button"
            onClick={addExperience}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add first role</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 relative">
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition p-1"
                title="Remove role"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pr-6">
                <input
                  placeholder="Job title (e.g. Software Engineer)"
                  value={exp.title || ''}
                  onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20"
                />
                <input
                  placeholder="Company (e.g. Paystack, Interswitch)"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20"
                />
                <input
                  placeholder="Period (e.g. 2022 - Present)"
                  value={exp.period || ''}
                  onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20"
                />
              </div>
              <textarea
                rows="2"
                placeholder="Key responsibilities and achievements…"
                value={exp.description || ''}
                onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 resize-none"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another role</span>
          </button>
        </div>
      )}
    </div>
  );
}
