import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, AlertCircle, Briefcase } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge.jsx';
import { calculateMatchScore } from '../lib/matchScore.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSavedJobs } from '../context/SavedJobsContext.jsx';

export function initials(name) {
  return String(name || '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function JobCard({
  job,
  candidateProfile: propCandidateProfile,
  isSaved: propIsSaved,
  onToggleBookmark,
}) {
  const { user } = useAuth();
  const { isSaved: checkIsSaved, toggleSaveJob } = useSavedJobs();

  const isSaved = propIsSaved !== undefined ? propIsSaved : checkIsSaved(job?.id);
  const candidateProfile =
    propCandidateProfile !== undefined ? propCandidateProfile : user?.profile;

  const co = job.company || {};

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
    if (onToggleBookmark) {
      onToggleBookmark(job.id, !isSaved);
    }
  };

  const computedMatchScore = useMemo(() => {
    return job.matchScore || (candidateProfile ? calculateMatchScore(job, candidateProfile) : null);
  }, [job, candidateProfile]);

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="flex items-start gap-4 p-5 bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg rounded-2xl my-3.5 transition-all duration-200 no-underline text-slate-950 group relative"
    >
      <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 border border-indigo-800/40 shadow-xs flex items-center justify-center font-bold text-sm shrink-0">
        {initials(co.name)}
      </span>
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
          <h3 className="text-base font-bold text-slate-900 m-0 group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>

          {/* Match score fit badge */}
          {computedMatchScore && <MatchScoreBadge matchScore={computedMatchScore} />}
        </div>

        <span className="text-xs md:text-sm text-slate-500 flex items-center gap-2 flex-wrap mb-2.5">
          <span className="capitalize font-medium text-slate-700">{job.workMode}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.city || 'Remote · Nigeria'}</span>
          </span>
          <span>·</span>
          <span className="font-medium text-slate-600">{co.name}</span>
        </span>

        {/* Required skills chips */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {job.requiredSkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-50/70 text-indigo-950 border border-indigo-100/80"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}

        <span className="flex items-center gap-2 flex-wrap">
          {co.verificationLevel === 'L2' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Employer
            </span>
          )}
          {job.clientName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
              <Briefcase className="w-3 h-3 text-slate-500" />
              <span>for {job.clientName}</span>
            </span>
          )}
        </span>
      </div>

      {/* Bookmark button */}
      <button
        type="button"
        onClick={toggleSave}
        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
          isSaved
            ? 'bg-indigo-950 text-amber-400 border border-indigo-900 shadow-xs'
            : 'bg-slate-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600'
        }`}
        title={isSaved ? 'Remove bookmark' : 'Save job'}
        aria-label="Save job"
      >
        <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
      </button>
    </Link>
  );
}
