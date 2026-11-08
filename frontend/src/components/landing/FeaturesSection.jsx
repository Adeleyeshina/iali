import { Clock, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

// Four flagship features grid
export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-26 max-w-[1120px] mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600 block mb-2.5">
          The ialihub Advantage
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-950 mb-3.5">
          Built To Help You Stand Out
        </h2>
        <p className="text-slate-600 text-base sm:text-lg">
          Our transparency features guide you in presenting your best self and eliminate the guesswork from Nigerian hiring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-9">
        {/* Feature 1: Application Tracker */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4.5">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <Clock className="w-6.5 h-6.5" />
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-[26px] text-slate-950">
            Application Progress Tracking
          </h3>
          <p className="text-base sm:text-[17px] text-slate-600 leading-relaxed">
            Track each job application live from submission to review, interview, and offer. View complete stage history timelines with recruiter notes and instant email updates. Zero ghosting.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span>Frontend Engineer · TechLagos</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Interview Stage
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Updated 2 hours ago by Hiring Lead</span>
            </div>
          </div>
        </div>

        {/* Feature 2: Match Score */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4.5">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6.5 h-6.5" />
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-[26px] text-slate-950">
            Rule-Based Match Score (60/25/15)
          </h3>
          <p className="text-base sm:text-[17px] text-slate-600 leading-relaxed">
            No black-box algorithms. We calculate objective fit based on required skills overlap (60%), role title similarity (25%), and location fit (15%). Know if you’re a Strong, Good, or Low match upfront.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div>
              <b className="text-sm font-bold text-slate-900 block">Candidate Fit Engine</b>
              <span className="text-xs text-slate-500">Skills (60) + Role (25) + Location (15)</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm">
              92% Strong Match
            </span>
          </div>
        </div>

        {/* Feature 3: Completeness Meter */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4.5">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6.5 h-6.5" />
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-[26px] text-slate-950">
            Profile Completeness Meter (0–100%)
          </h3>
          <p className="text-base sm:text-[17px] text-slate-600 leading-relaxed">
            Our 7-part weighted meter highlights exactly what to add next to reach 80%+. Unlock prioritized recruiter search visibility and get discovered by premier employers.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Profile Progress</span>
              <span className="text-indigo-600">85% Complete</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-brand h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-xs text-slate-500 block">
              Next action: Upload profile photo (+5%) to reach 90%
            </span>
          </div>
        </div>

        {/* Feature 4: Verified Recruiter Messaging */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4.5">
          <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
            <MessageSquare className="w-6.5 h-6.5" />
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-[26px] text-slate-950">
            Direct Verified Recruiter Chat
          </h3>
          <p className="text-base sm:text-[17px] text-slate-600 leading-relaxed">
            Cut out third-party recruiters and lost emails. Chat directly inside ialihub with company hiring managers who have been manually verified by our team.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-950 text-white flex items-center justify-center font-bold text-sm">
              TL
            </div>
            <div className="text-xs sm:text-sm">
              <b className="text-slate-900 block font-bold">TechLagos Talent Lead</b>
              <span className="text-slate-500">“Hi Adaeze, we loved your profile match score for our role…”</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
