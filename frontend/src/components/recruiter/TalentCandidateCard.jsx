import { MapPin, MessageSquare, CheckCircle2, User, Eye } from 'lucide-react';

// Candidate card in recruiter talent discovery search with interactive profile viewing
export default function TalentCandidateCard({
  cand,
  onOpenMessage,
  onViewProfile,
  hasMessaged,
}) {
  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('actively')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Actively looking
        </span>
      );
    }
    if (lower.includes('open')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          Open to offers
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
        Exploring
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3">
          <div
            onClick={() => onViewProfile && onViewProfile(cand)}
            className={onViewProfile ? 'cursor-pointer' : ''}
          >
            {cand.photoUrl ? (
              <img
                src={cand.photoUrl}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-xs shadow-xs border border-indigo-800/40">
                {cand.name ? cand.name.slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
              </div>
            )}
          </div>

          <div
            onClick={() => onViewProfile && onViewProfile(cand)}
            className={onViewProfile ? 'cursor-pointer group' : ''}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <b
                className={`text-sm font-bold text-slate-900 ${
                  onViewProfile ? 'group-hover:text-indigo-600 transition' : ''
                }`}
              >
                {cand.name}
              </b>
              {getStatusBadge(cand.availability)}
              {cand.completeness?.score >= 100 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  100% Vetted
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 block">
              {cand.headline || 'Software Engineer'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {cand.city || 'Nigeria'}
          </span>
          {cand.workModePref && (
            <span className="capitalize text-slate-600 font-medium">
              Prefers {cand.workModePref}
            </span>
          )}
        </div>

        {Array.isArray(cand.skills) && cand.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {cand.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-50/70 text-indigo-950 border border-indigo-100/80 font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {onViewProfile && (
          <button
            type="button"
            onClick={() => onViewProfile(cand)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>View Profile</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onOpenMessage(cand)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-950 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-coral-400" />
          <span>{hasMessaged ? 'Message Sent' : 'Direct Message'}</span>
        </button>
      </div>
    </div>
  );
}
