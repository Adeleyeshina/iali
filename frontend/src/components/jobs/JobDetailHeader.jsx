import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Flag, Building2, MapPin, Star, Edit3 } from 'lucide-react';
import MatchScoreBadge from '../MatchScoreBadge.jsx';
import { copyToClipboard } from '../../lib/clipboard.js';
import { useSavedJobs } from '../../context/SavedJobsContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Top breadcrumbs, role title, company metadata, and action bar
export default function JobDetailHeader({ job, onOpenReport }) {
  const company = job.company || {};
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const { user } = useAuth();
  const saved = isSaved(job?.id);
  const isRecruiterOrAdmin = user?.role === 'recruiter' || user?.role === 'admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all jobs</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSaveJob(job.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-2xs ${
              saved
                ? 'border-coral-200 bg-coral-50/70 text-coral-600'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${saved ? 'fill-coral-500 text-coral-500' : 'text-slate-400'}`} />
            <span>{saved ? 'Saved' : 'Save Job'}</span>
          </button>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                window.location.href,
                'Job link copied to clipboard!'
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold text-slate-500 transition cursor-pointer shadow-2xs"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
          {isRecruiterOrAdmin && (
            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Manage and edit your listings in My Jobs"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Manage in My Jobs</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800">
                {job.workMode || 'remote'}
              </span>
              {job.city && (
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {job.city}
                </span>
              )}
              {job.matchScore && <MatchScoreBadge scoreData={job.matchScore} size="sm" />}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Building2 className="w-4 h-4 text-zinc-400" />
              <span className="font-semibold text-zinc-900">{company.name || 'Verified Employer'}</span>
              {job.clientName && (
                <span className="text-xs text-zinc-400">· via {job.clientName}</span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-zinc-400 block mb-0.5">Posted</span>
            <span className="text-xs font-semibold text-zinc-700">
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
