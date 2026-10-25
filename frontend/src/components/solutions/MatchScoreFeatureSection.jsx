import { ShieldCheck } from 'lucide-react';

// Feature breakdown for rule-based 60/25/15 match score engine
export default function MatchScoreFeatureSection() {
  return (
    <section id="match-score" className="py-12 border-t border-slate-200/80 bg-white">
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider inline-block">
              Feature 1 · Compatibility Engine
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-950">
              Rule-Based Fit Match Score
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Most job boards rank candidates with opaque AI that hallucinates or discriminates. ialihub uses a clean, transparent mathematical formula so you always know why you are a fit:
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <b className="text-slate-900 block">Skills Overlap (60% Weight)</b>
                  <span className="text-slate-500">Candidate skill tags vs Job required skills</span>
                </div>
                <span className="font-bold text-indigo-600 text-sm">60%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <b className="text-slate-900 block">Role Similarity (25% Weight)</b>
                  <span className="text-slate-500">Candidate headline keywords vs Job title</span>
                </div>
                <span className="font-bold text-rose-500 text-sm">25%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <b className="text-slate-900 block">Location Fit (15% Weight)</b>
                  <span className="text-slate-500">City match, Remote option, Willing to relocate</span>
                </div>
                <span className="font-bold text-emerald-600 text-sm">15%</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <b className="text-sm font-bold text-slate-900">Job Fit Simulation</b>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                Strong Match (92%)
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Skills: React, Node.js, PostgreSQL, Docker</span>
                <span className="font-bold text-emerald-600">4/4 matched</span>
              </div>
              <div className="flex justify-between">
                <span>Headline: "Lead Full-Stack Software Engineer"</span>
                <span className="font-bold text-emerald-600">High role match</span>
              </div>
              <div className="flex justify-between">
                <span>Location: Lagos / Remote Preferred</span>
                <span className="font-bold text-emerald-600">100% location fit</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Computed live for every job without bias</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
