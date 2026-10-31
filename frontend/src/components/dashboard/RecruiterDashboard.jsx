import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  PlusCircle,
  Users,
  ArrowRight,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import CandidateProfileModal from '../recruiter/CandidateProfileModal.jsx';

// Recruiter hub overview with metrics, active jobs, talent search, and candidate cards
export default function RecruiterDashboard({
  myJobs = [],
  loadingJobs = false,
  candidates = [],
  searchQuery,
  setSearchQuery,
  onSearch,
}) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();
  const liveJobsCount = myJobs.filter((j) => (j.status || 'Live') === 'Live').length;
  const totalApplications = myJobs.reduce(
    (sum, j) => sum + (j._count?.applications || 0),
    0
  );

  return (
    <>
      {/* Hero Search & Actions Banner */}
      <section className="bg-gradient-hero border border-indigo-900/40 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 mb-3 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Employer Workspace
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Hire vetted Nigerian tech talent
            </h1>
            <p className="text-indigo-200/90 text-xs md:text-sm max-w-xl leading-relaxed">
              Manage your job listings, review applicants, and source vetted developers across Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
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
              <span>Manage all jobs</span>
            </Link>
          </div>
        </div>

        {/* Talent Search input */}
        <form onSubmit={onSearch} className="relative z-10 mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
            <input
              type="text"
              placeholder="Search talent by skill (e.g. React, Node.js, Python, UI/UX)…"
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

      {/* Recruiter Stats Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {loadingJobs ? '…' : liveJobsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Active Live Roles</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {loadingJobs ? '…' : totalApplications}
            </span>
            <span className="text-xs text-slate-500 font-medium">Total Applicants Received</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {candidates.length > 0 ? `${candidates.length}+` : '0'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Verified Candidates Available</span>
          </div>
        </div>
      </section>

      {/* My Job Openings Section (Replaces candidate recommended roles) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-700" />
            <h2 className="text-lg font-bold text-slate-900 m-0">My Open Roles</h2>
          </div>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
          >
            <span>View & manage all ({myJobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="space-y-3">
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ) : myJobs.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No job listings yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Post your first job opening to reach verified candidates across Nigeria and start reviewing applications.
            </p>
            <Link
              to="/post-job"
              className="px-4 py-2 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Role Now</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myJobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs rounded-2xl p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 m-0">{job.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        job.status === 'Closed'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {job.status || 'Live'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 m-0 capitalize">
                    {job.workMode} · {job.city || 'Remote'} · Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong className="text-slate-900 font-bold">{job._count?.applications || 0}</strong>{' '}
                      {(job._count?.applications || 0) === 1 ? 'applicant' : 'applicants'}
                    </span>
                  </div>
                  <Link
                    to={`/recruiter/jobs/${job.id}/applicants`}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3 h-3 text-coral-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Verified Talent Pool Preview */}
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
            <span>Search all candidates</span>
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
                      <span className="text-[11px] text-slate-500 truncate block">
                        {cand.headline || 'Software Engineer'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{cand.city || 'Nigeria'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(cand.skills || []).slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(cand)}
                  className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200 text-indigo-950 text-xs font-bold text-center transition cursor-pointer shadow-2xs border border-indigo-100/80"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        isOpen={Boolean(selectedCandidate)}
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onOpenMessage={(target) => {
          const targetId = target.id || target.userId;
          navigate(`/inbox?candidateId=${targetId}&name=${encodeURIComponent(target.name || '')}`);
        }}
      />
    </>
  );
}
