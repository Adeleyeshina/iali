import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

// Feature breakdown for real-time application tracker and milestone history
export default function ApplicationTrackerFeatureSection() {
  return (
    <section id="tracker" className="py-12 border-t border-slate-200/80 bg-white">
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider inline-block">
              Feature 3 · No More Ghosting
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-950">
              Live Application Progress Tracking
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every application on ialihub has an immutable status history timeline. You see when the hiring team views your CV, shortlists you, schedules an interview, or makes an offer.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Plus, our automated notification system triggers instant updates on every milestone change, so you never miss an interview opportunity.
            </p>
            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-950 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition"
              >
                <span>Start Tracking Applications Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-sm space-y-3">
            <b className="text-sm font-bold text-slate-900 block pb-2 border-b border-slate-200">
              Application Timeline: Senior Backend Developer
            </b>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-slate-900 block">Stage: Interview Scheduled</b>
                  <span className="text-[11px] text-slate-500">Oct 25, 2026 · Updated by TechLagos Lead</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-slate-900 block">Stage: Shortlisted</b>
                  <span className="text-[11px] text-slate-500">Oct 23, 2026 · Recruiter marked profile</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-slate-900 block">Stage: Application Submitted</b>
                  <span className="text-[11px] text-slate-500">Oct 21, 2026 · Match Score: 95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
