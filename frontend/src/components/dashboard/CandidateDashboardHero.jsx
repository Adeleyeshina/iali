import { Search, Sparkles, UploadCloud } from 'lucide-react';

const CANDIDATE_STATUSES = [
  { value: 'Actively looking for a job', label: 'Actively looking for a job', dotBg: 'bg-emerald-400' },
  { value: 'Employed, but open to opportunities', label: 'Employed, open to offers', dotBg: 'bg-amber-400' },
  { value: 'Employed, not looking', label: 'Employed, not looking', dotBg: 'bg-indigo-300' },
  { value: 'Just exploring / curious', label: 'Just exploring / curious', dotBg: 'bg-rose-400' },
];

// Candidate hero with availability status dropdown and search
export default function CandidateDashboardHero({
  user,
  currentStatus,
  onUpdateStatus,
  updatingStatus,
  searchQuery,
  setSearchQuery,
  onSearch,
  onOpenCvModal,
}) {
  const currentStatusObj =
    CANDIDATE_STATUSES.find((s) => s.value === currentStatus) || CANDIDATE_STATUSES[0];

  return (
    <section className="bg-gradient-hero border border-indigo-900/40 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-md relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 -bottom-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              <span className={`w-2 h-2 rounded-full ${currentStatusObj.dotBg} animate-pulse`}></span>
              Status:
              <select
                value={currentStatus}
                onChange={(e) => onUpdateStatus(e.target.value)}
                disabled={updatingStatus}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer border-none py-0 pl-1 pr-3"
              >
                {CANDIDATE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-indigo-950 text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </span>
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-indigo-200/90 text-xs md:text-sm max-w-xl leading-relaxed">
            Discover verified tech, product, and engineering roles tailored to your stack across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCvModal}
            className="px-4 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs md:text-sm hover:bg-indigo-50 transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Drop CV for instant match</span>
          </button>
        </div>
      </div>

      <form onSubmit={onSearch} className="relative z-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
          <input
            type="text"
            placeholder="Search roles by title or tech stack (e.g. React, Node.js, Fintech, Designer)…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-indigo-200/60 text-xs md:text-sm focus:outline-none focus:bg-white/20 focus:border-indigo-400 transition"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-coral hover:opacity-95 text-white font-bold text-xs md:text-sm transition shrink-0 cursor-pointer shadow-md"
        >
          Search jobs
        </button>
      </form>
    </section>
  );
}
