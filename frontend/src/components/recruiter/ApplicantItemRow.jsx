import { MapPin, Mail, Phone, MessageSquare, Clock, User } from 'lucide-react';
import MatchScoreBadge from '../MatchScoreBadge.jsx';

// Single applicant row with stage progress updater, profile viewing, and messaging
export default function ApplicantItemRow({
  app,
  onOpenTimeline,
  onOpenMessage,
  onViewProfile,
  onUpdateStatus,
  updatingId,
}) {
  const cand = app.candidate || {};
  const prof = cand.profile || {};
  const scoreData = app.matchScore;

  const handleProfileClick = () => {
    if (onViewProfile) {
      onViewProfile({
        ...prof,
        ...cand,
        userId: cand.id || prof.userId,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            onClick={handleProfileClick}
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-xs shadow-xs border border-indigo-800/40 shrink-0 ${
              onViewProfile ? 'cursor-pointer hover:opacity-90' : ''
            }`}
          >
            {cand.name ? cand.name.slice(0, 2).toUpperCase() : 'CA'}
          </div>

          <div
            onClick={handleProfileClick}
            className={onViewProfile ? 'cursor-pointer group' : ''}
          >
            <b
              className={`text-sm font-bold text-slate-900 block ${
                onViewProfile ? 'group-hover:text-indigo-600 transition' : ''
              }`}
            >
              {cand.name || 'Anonymous Candidate'}
            </b>
            <span className="text-xs text-slate-500 block">
              {prof.headline || 'Job Seeker'}
            </span>
          </div>

          {scoreData && <MatchScoreBadge scoreData={scoreData} size="sm" />}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {prof.city || 'Nigeria'}
          </span>
          {cand.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {cand.email}
            </span>
          )}
          {cand.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {cand.phone}
            </span>
          )}
        </div>

        {Array.isArray(prof.skills) && prof.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {prof.skills.slice(0, 5).map((skill, i) => (
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

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {onViewProfile && (
          <button
            type="button"
            onClick={handleProfileClick}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Profile</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenTimeline(app)}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-xs font-semibold text-slate-800 transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenMessage(cand)}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-xs font-semibold text-slate-800 transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-coral-500" />
          <span>Message</span>
        </button>

        <select
          value={app.rejected ? 'Rejected' : app.status}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'Rejected') {
              onUpdateStatus(app.id, app.status, true);
            } else {
              onUpdateStatus(app.id, val, false);
            }
          }}
          disabled={updatingId === app.id}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 transition cursor-pointer shadow-2xs"
        >
          <option value="Submitted">Stage: Submitted</option>
          <option value="Viewed">Stage: Viewed</option>
          <option value="Shortlisted">Stage: Shortlisted</option>
          <option value="Interview">Stage: Interview</option>
          <option value="Offer">Stage: Offer</option>
          <option value="Hired">Stage: Hired</option>
          <option value="Rejected">Status: Not Selected</option>
        </select>
      </div>
    </div>
  );
}
