// Feature breakdown for profile completeness meter and priority recruiter search
export default function CompletenessFeatureSection() {
  return (
    <section id="completeness" className="py-12 border-t border-slate-200/80 bg-slate-50/70">
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 order-2 md:order-1">
            <div className="flex items-center justify-between">
              <div>
                <b className="text-sm font-bold text-slate-900 block">Profile Completeness</b>
                <span className="text-[11px] text-slate-500">Weighted 0-100% calculation</span>
              </div>
              <span className="text-xl font-heading font-extrabold text-indigo-600">
                85%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-brand h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900">
              <b>Next Action:</b> Upload your profile photo (+5%) to reach 90%!
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <span>✓ Basic Info: 15%</span>
              <span>✓ Skills (5+): 20%</span>
              <span>✓ Work Experience: 20%</span>
              <span>✓ CV Uploaded: 20%</span>
              <span>✓ Education: 10%</span>
              <span>✓ Short Bio: 10%</span>
            </div>
          </div>

          <div className="space-y-4 order-1 md:order-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider inline-block">
              Feature 2 · Visibility Meter
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-950">
              Profile Completeness & Priority Search
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Candidates with complete profiles get hired 4x faster. Our meter calculates a weighted score across 7 key areas and tells you the exact next best step to reach 80%+.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              When verified recruiters search the ialihub talent pool, they use our <b>"Complete profiles only (80%+)"</b> filter. Crossing this threshold unlocks maximum recruiter outreach!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
