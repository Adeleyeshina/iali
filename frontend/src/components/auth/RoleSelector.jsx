import { User, Building2 } from 'lucide-react';

// Persona selection toggle between candidate and recruiter in Electric Indigo & Coral theme
export default function RoleSelector({ role, onChangeRole }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
        I am registering as:
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChangeRole('candidate')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
            role === 'candidate'
              ? 'border-indigo-600 bg-gradient-brand text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-900 shadow-2xs'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              role === 'candidate'
                ? 'bg-white/20 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold truncate">Candidate</div>
            <div
              className={`text-[10px] sm:text-[11px] truncate ${
                role === 'candidate' ? 'text-indigo-100' : 'text-slate-500'
              }`}
            >
              Seeking jobs & discovery
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChangeRole('recruiter')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
            role === 'recruiter'
              ? 'border-indigo-600 bg-gradient-brand text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-900 shadow-2xs'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              role === 'recruiter'
                ? 'bg-white/20 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
            }`}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold truncate">Employer</div>
            <div
              className={`text-[10px] sm:text-[11px] truncate ${
                role === 'recruiter' ? 'text-indigo-100' : 'text-slate-500'
              }`}
            >
              Hiring verified talent
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
