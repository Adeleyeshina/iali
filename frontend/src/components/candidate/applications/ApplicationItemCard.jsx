import { Link } from 'react-router-dom';
import { Building2, MapPin, Clock, XCircle, ArrowRight } from 'lucide-react';
import MatchScoreBadge from '../../MatchScoreBadge.jsx';

// Candidate application card with live status and history timeline modal trigger
export default function ApplicationItemCard({
  app,
  onOpenTimeline,
  onRequestWithdraw,
  withdrawingId,
}) {
  const getStatusBadge = (status, rejected) => {
    if (rejected) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          Not Selected
        </span>
      );
    }
    const map = {
      Submitted: { bg: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-500' },
      Viewed: { bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
      Shortlisted: { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', dot: 'bg-indigo-600' },
      Interview: { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', dot: 'bg-indigo-600' },
      Offer: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
      Hired: { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-600' },
      Withdrawn: { bg: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
    };
    const s = map[status] || map.Submitted;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
        {status}
      </span>
    );
  };

  const job = app.job || {};
  const isWithdrawn = app.status === 'Withdrawn';
  const isRejected = app.rejected;
  const canWithdraw = !isWithdrawn && !isRejected && app.status !== 'Hired';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {getStatusBadge(app.status, app.rejected)}
          {app.matchScore && <MatchScoreBadge scoreData={app.matchScore} size="sm" />}
          <span className="text-xs text-slate-400">
            Applied {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div>
          <Link
            to={`/jobs/${job.id}`}
            className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors no-underline"
          >
            {job.title || 'Untitled Role'}
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {job.company?.name || 'Verified Company'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.city || 'Nigeria'} · {job.workMode || 'remote'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={() => onOpenTimeline(app)}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-xs font-semibold text-slate-800 transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>View Timeline</span>
        </button>

        {canWithdraw && (
          <button
            type="button"
            onClick={() => onRequestWithdraw(app)}
            disabled={withdrawingId === app.id}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold transition inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Withdraw</span>
          </button>
        )}

        <Link
          to={`/jobs/${job.id}`}
          className="px-4 py-1.5 rounded-xl bg-indigo-950 hover:bg-slate-900 text-white text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-xs no-underline"
        >
          <span>Job Details</span>
          <ArrowRight className="w-3 h-3 text-indigo-300" />
        </Link>
      </div>
    </div>
  );
}
