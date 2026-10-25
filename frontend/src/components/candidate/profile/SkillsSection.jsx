import SkillTagInput from '../../SkillTagInput.jsx';

// Skills tag list with suggestions and minimum requirement badge
export default function SkillsSection({ profile, setProfile, breakdown, sectionRef }) {
  return (
    <div className="space-y-3" ref={sectionRef}>
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5 min-w-0">
          <span className="truncate">2. Skills (at least 5 required)</span>
        </span>
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 shrink-0">
          {breakdown?.skills ?? 0} / 20%
        </span>
      </div>

      <SkillTagInput
        skills={profile.skills || []}
        onChange={(newSkills) => setProfile({ ...profile, skills: newSkills })}
        placeholder="Type skill tag (e.g. React) and press Enter…"
        hint="Stored as distinct tags. Autocomplete offers suggestions or add custom tags."
      />
    </div>
  );
}
