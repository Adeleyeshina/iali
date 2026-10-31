import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

// Sidebar sticky card with apply button and recruiter safety badge
export default function JobDetailSidebar({
  job,
  hasApplied,
  applicationStatus,
  applying,
  onApply,
  errorMessage,
  successMessage,
}) {
  const company = job?.company || {};

  return (
    <div className="space-y-4">
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4 sticky top-24">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
            Application Status
          </span>
          {hasApplied ? (
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Applied · Stage: {applicationStatus || 'Submitted'}</span>
              </div>
              <Link
                to="/applications"
                className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition py-1"
              >
                Track in Applications Pipeline →
              </Link>
            </div>
          ) : job?.status === 'Closed' ? (
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
              <span>Applications Closed · This role is no longer accepting applications</span>
            </div>
          ) : (
            <Link
              to={`/jobs/${job?.id}/apply`}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-sm font-bold transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Apply for this Role</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verified Employer Guarantee</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            All recruiters on Ialihub are vetted. Candidates are never charged any application or placement fees.
          </p>
        </div>
      </div>
    </div>
  );
}
