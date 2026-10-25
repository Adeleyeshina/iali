import { Check, X, CheckCircle2 } from 'lucide-react';

// Moderation queue for review and approval of new job posts
export default function PendingJobsQueue({
  pendingJobs,
  onDecision,
  decidingId,
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-zinc-900">
          Jobs pending review ({pendingJobs.length})
        </h3>
      </div>

      {pendingJobs.length === 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium py-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All pending job posts have been reviewed!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <b className="text-sm font-bold text-zinc-900 block">{job.title}</b>
                <span className="text-xs text-zinc-500">
                  {job.company?.name || 'Company'} · {job.city || 'Lagos'} ({job.workMode})
                </span>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{job.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onDecision('job', job.id, true)}
                  disabled={decidingId === job.id}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDecision('job', job.id, false)}
                  disabled={decidingId === job.id}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
