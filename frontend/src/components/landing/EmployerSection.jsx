import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';

// Employer section with recruiter photo and hiring value props
export default function EmployerSection() {
  return (
    <section className="py-20 md:py-26 bg-white border-y border-slate-200/80">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>For Employers & Hiring Teams</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-950 leading-tight">
              Hire Nigeria’s Pre-Vetted Tech Talent in Days
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Stop reviewing hundreds of mismatched, incomplete resumes. ialihub gives Nigerian employers the modern tools to find, filter, and contact verified talent instantly.
            </p>

            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <b className="text-base sm:text-lg font-bold text-slate-900 block">
                    "Complete Profiles Only (80%+)" Filter
                  </b>
                  <span className="text-sm text-slate-600 leading-relaxed block mt-0.5">
                    Search the talent pool and view only candidates who have completed skills, experience, CV, and bio.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <b className="text-base sm:text-lg font-bold text-slate-900 block">
                    Instant Match Score Sorting
                  </b>
                  <span className="text-sm text-slate-600 leading-relaxed block mt-0.5">
                    Sort applicants by their exact 60/25/15 match score to review the most qualified candidates first.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <b className="text-base sm:text-lg font-bold text-slate-900 block">
                    Direct Candidate Outreach
                  </b>
                  <span className="text-sm text-slate-600 leading-relaxed block mt-0.5">
                    Start real-time conversations without cold emails or unread LinkedIn messages.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/signup?role=recruiter"
                className="px-7 py-4 rounded-2xl bg-indigo-950 hover:bg-slate-900 text-white text-sm sm:text-base font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Post a Job Free</span>
                <ArrowRight className="w-4.5 h-4.5 text-rose-400" />
              </Link>
              <Link
                to="/solutions"
                className="px-6 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-semibold transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Photo Showcase */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-3">
              <img
                src="/recruiter-showcase.jpg"
                alt="Nigerian tech recruiter reviewing candidates in Victoria Island Lagos office"
                className="w-full h-[380px] sm:h-[460px] object-cover rounded-2xl"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 p-4.5 rounded-2xl glass-panel shadow-xl text-left max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                <b className="text-sm font-bold text-slate-900">4.8x Faster Time-to-Hire</b>
              </div>
              <span className="text-xs sm:text-sm text-slate-500 leading-normal block">
                Employers using match score sorting fill tech roles in an average of 9 days.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
