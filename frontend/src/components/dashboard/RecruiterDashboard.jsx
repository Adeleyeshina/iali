import { Link } from 'react-router-dom';
import { Briefcase, Search, PlusCircle, Users, ArrowRight, MapPin } from 'lucide-react';

// Recruiter hub overview with quick candidate search and talent cards
export default function RecruiterDashboard({
  candidates,
  searchQuery,
  setSearchQuery,
  onSearch,
}) {
  return (
    <>
      <section className="bg-gradient-hero border border-indigo-900/40 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 mb-3 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Recruiter Workspace
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Hire vetted Nigerian tech talent
            </h1>
            <p className="text-indigo-200/90 text-xs md:text-sm max-w-xl leading-relaxed">
              Post verified jobs or search vetted talent across Lagos, Abuja, Port Harcourt and remote.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/post-job"
              className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs md:text-sm hover:bg-indigo-50 transition shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Post a new role</span>
            </Link>
            <Link
              to="/recruiter/jobs"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm border border-white/20 transition flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-300" />
              <span>My posted jobs</span>
            </Link>
          </div>
        </div>

        <form onSubmit={onSearch} className="relative z-10 mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
            <input
              type="text"
              placeholder="Search talent by skill (e.g. React, Node.js, Product Designer)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-indigo-200/60 text-xs md:text-sm focus:outline-none focus:bg-white/20 focus:border-indigo-400 transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-coral hover:opacity-95 text-white font-bold text-xs md:text-sm transition shrink-0 cursor-pointer shadow-md"
          >
            Search talent
          </button>
        </form>
      </section>

      {/* Featured Talent Pool Preview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-700" />
            <h2 className="text-lg font-bold text-slate-900 m-0">Recent verified talent</h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
          >
            <span>View all candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
            No talent matching query yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-950 text-indigo-200 flex items-center justify-center font-bold text-xs">
                      {cand.name ? cand.name.slice(0, 2).toUpperCase() : 'TA'}
                    </div>
                    <div className="overflow-hidden">
                      <b className="text-xs font-bold text-slate-900 truncate block">{cand.name}</b>
                      <span className="text-[11px] text-slate-500 truncate block">{cand.headline || 'Software Engineer'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{cand.city || 'Nigeria'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(cand.skills || []).slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={`/search?q=${encodeURIComponent(cand.name || '')}`}
                  className="w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[11px] font-semibold text-center transition"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
