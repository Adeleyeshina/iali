const CANDIDATE_STATUS_OPTIONS = [
  {
    value: 'Actively looking for a job',
    label: 'Actively looking for a job',
    sub: 'Immediate start',
    dotBg: 'bg-emerald-500',
  },
  {
    value: 'Employed, but open to opportunities',
    label: 'Employed, open to offers',
    sub: 'Open to better roles',
    dotBg: 'bg-indigo-500',
  },
  {
    value: 'Employed, not looking',
    label: 'Employed, not looking',
    sub: 'Networking only',
    dotBg: 'bg-slate-400',
  },
  {
    value: 'Just exploring / curious',
    label: 'Just exploring / curious',
    sub: 'Salary & market research',
    dotBg: 'bg-rose-400',
  },
];

// Specific input fields for candidate signup
export default function CandidateFields({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Current Job Search Status
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CANDIDATE_STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition ${
                formData.availability === opt.value
                  ? 'border-indigo-600 bg-indigo-50/70 font-bold text-indigo-950 ring-1 ring-indigo-500/20 shadow-2xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="availability"
                value={opt.value}
                checked={formData.availability === opt.value}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="hidden"
              />
              <span className={`w-2.5 h-2.5 rounded-full ${opt.dotBg} shrink-0`}></span>
              <div className="overflow-hidden">
                <span className="block truncate">{opt.label}</span>
                <span className="text-[10px] text-slate-400 font-normal block">{opt.sub}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Phone Number <span className="text-slate-400 font-normal">(Optional, for WhatsApp alerts)</span>
        </label>
        <input
          type="tel"
          placeholder="e.g. +234 801 234 5678"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-2xs"
        />
      </div>
    </>
  );
}
