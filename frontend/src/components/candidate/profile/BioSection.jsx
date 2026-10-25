// Short professional bio and career goals
export default function BioSection({ profile, setProfile, breakdown, sectionRef }) {
  return (
    <div className="space-y-3" ref={sectionRef}>
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
          <span>6. Short Bio / Summary (10%)</span>
        </span>
        <span className="text-[11px] font-bold text-zinc-400">
          {breakdown?.bio ?? 0} / 10%
        </span>
      </div>

      <textarea
        rows="3"
        placeholder="Introduce your background, key strengths, and what kind of opportunities you are seeking…"
        value={profile.summary || ''}
        onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition resize-none shadow-xs"
      />
    </div>
  );
}
