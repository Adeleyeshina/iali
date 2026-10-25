import { GraduationCap, Plus, Trash2 } from 'lucide-react';

// Education credentials with add and delete handlers
export default function EducationSection({
  educations,
  addEducation,
  updateEducation,
  removeEducation,
  breakdown,
  sectionRef,
}) {
  return (
    <div className="space-y-3" ref={sectionRef}>
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5 min-w-0">
          <GraduationCap className="w-4 h-4 text-zinc-500 shrink-0" />
          <span className="truncate">5. Education</span>
        </span>
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 shrink-0">
          {breakdown?.education ?? 0} / 10%
        </span>
      </div>

      {educations.length === 0 ? (
        <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-2.5">No education entries added yet.</p>
          <button
            type="button"
            onClick={addEducation}
            className="w-full sm:w-auto justify-center px-3.5 py-2 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add education</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {educations.map((edu, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 relative space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_90px] gap-2 flex-1 pr-8 sm:pr-0">
                <input
                  placeholder="Institution (e.g. Unilag)"
                  value={edu.school || ''}
                  onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20"
                />
                <input
                  placeholder="Degree / Course (e.g. B.Sc)"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20"
                />
                <input
                  placeholder="Year"
                  value={edu.year || ''}
                  onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20"
                />
              </div>
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute top-2.5 right-2.5 sm:static sm:top-auto sm:right-auto text-slate-400 hover:text-rose-600 transition p-1 shrink-0"
                title="Remove education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="w-full sm:w-auto justify-center px-3.5 py-2 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another education</span>
          </button>
        </div>
      )}
    </div>
  );
}
