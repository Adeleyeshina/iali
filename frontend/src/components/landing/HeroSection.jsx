import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Sparkles, CheckCircle2, Clock } from 'lucide-react';

// Hero section with dynamic headline, floating metrics and photography
export default function HeroSection() {
  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Ambient background blur in electric indigo and warm coral */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1120px] h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-rose-200/35 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 text-center">
        {/* Announcement pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-950 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs animate-float-gentle">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Nigeria’s Premier Rule-Based Hiring Marketplace</span>
        </div>

        {/* Main headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.1] mb-6">
          Everything You Need for a <span className="text-gradient-brand">Successful</span> Career & Hiring Journey
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          ialihub eliminates the black box of African hiring with transparent 60/25/15 match scores, live stage-by-stage application tracking, and verified direct recruiter outreach.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-brand hover:brightness-105 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/jobs"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Browse Open Jobs</span>
          </Link>
        </div>

        {/* Visual showcase with Lagos tech photo and floating widgets */}
        <div className="relative max-w-4xl mx-auto">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xl relative overflow-hidden group">
            <div className="relative h-[280px] sm:h-[380px] md:h-[440px] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src="/hero-talents.jpg"
                alt="Nigerian tech professionals collaborating in Lagos hub"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 text-left flex items-center justify-between text-white">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
                    Live Talent Network
                  </span>
                  <b className="text-base sm:text-lg font-bold">
                    Connecting Top Nigerian Talent with Verified Employers
                  </b>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>All 36 States & Remote</span>
                </span>
              </div>
            </div>
          </div>

          {/* Floating Widget 1: Match Score */}
          <div className="hidden lg:flex absolute -top-6 -left-6 p-4 rounded-2xl glass-panel shadow-xl items-center gap-3 animate-float-gentle max-w-xs text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 font-heading font-extrabold text-base shrink-0">
              95%
            </div>
            <div>
              <b className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                <span>Strong Fit Match</span>
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              </b>
              <span className="text-[11px] text-slate-500 block">
                Skills overlap 60% · Role 25% · Location 15%
              </span>
            </div>
          </div>

          {/* Floating Widget 2: Completeness */}
          <div className="hidden lg:flex absolute -top-6 -right-6 p-4 rounded-2xl glass-panel shadow-xl items-center gap-3 animate-float-gentle max-w-xs text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-heading font-extrabold text-base shrink-0">
              100%
            </div>
            <div>
              <b className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                <span>Complete Profile</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </b>
              <span className="text-[11px] text-slate-500 block">
                Unlocked in verified talent pool
              </span>
            </div>
          </div>

          {/* Floating Widget 3: Live Application Alert */}
          <div className="hidden lg:flex absolute -bottom-5 -left-5 p-3.5 rounded-2xl glass-panel shadow-xl items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <b className="text-xs font-bold text-slate-900 block">
                Stage: Interview Scheduled
              </b>
              <span className="text-[11px] text-slate-500 block">
                Recruiter updated status & triggered email
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
