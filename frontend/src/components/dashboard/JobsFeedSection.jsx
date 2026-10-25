import { Link } from 'react-router-dom';
import { Briefcase, Star, ArrowRight } from 'lucide-react';
import JobCard from '../JobCard.jsx';
import { useSavedJobs } from '../../context/SavedJobsContext.jsx';

// Interactive job feed tabs and cards list
export default function JobsFeedSection({
  jobViewTab,
  setJobViewTab,
  displayedJobs,
}) {
  const { savedCount, loadingSaved } = useSavedJobs();

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
            <Briefcase className="w-4 h-4" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 m-0">Recommended roles</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setJobViewTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              jobViewTab === 'all'
                ? 'bg-white text-indigo-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Latest openings
          </button>
          <button
            type="button"
            onClick={() => setJobViewTab('saved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              jobViewTab === 'saved'
                ? 'bg-white text-indigo-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-coral-500 fill-coral-400" />
            <span>Saved jobs</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gradient-coral text-white font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loadingSaved ? (
        <div className="space-y-3">
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center shadow-xs">
          <p className="text-xs md:text-sm text-slate-500 mb-4">
            {jobViewTab === 'saved'
              ? 'You have not saved any jobs yet. Click the star icon on any role to bookmark it.'
              : 'No open jobs found right now. Check back soon!'}
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-950 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs"
          >
            <span>Browse all live jobs</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}

          <div className="pt-2 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:text-indigo-600 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              <span>View all available jobs</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
