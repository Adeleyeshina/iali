import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

// Success card displayed after a job is successfully published
export default function PostJobSuccess({
  createdJob,
  onSwitchToRemote,
  switching,
  onReset,
}) {
  return (
    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <b className="text-base font-bold">Role Published Successfully!</b>
      </div>

      <p className="text-xs text-emerald-800 leading-relaxed">
        Your job post for <b>{createdJob.title}</b> is now live. Qualified candidates will see this role and can apply with 1-click.
      </p>

      {createdJob.notice && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <b>Notice:</b> {createdJob.notice}
          {createdJob.workMode !== 'remote' && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onSwitchToRemote}
                disabled={switching}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                {switching ? 'Updating…' : 'Switch to Nationwide Remote'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 flex-wrap">
        <Link
          to={`/jobs/${createdJob.id}`}
          className="px-4 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
        >
          <span>View Live Post</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition cursor-pointer"
        >
          Post another opening
        </button>
      </div>
    </div>
  );
}
