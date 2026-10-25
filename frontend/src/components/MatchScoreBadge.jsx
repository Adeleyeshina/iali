import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HelpCircle, Check, ArrowRight } from 'lucide-react';

export default function MatchScoreBadge({ matchScore, showDetails = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!matchScore) return null;

  // Rule: If job has no required skills, do not show a score
  if (!matchScore.hasScore && matchScore.reason === 'no_job_skills') {
    return null;
  }

  // Rule: If candidate has no skills listed
  if (!matchScore.hasScore && matchScore.reason === 'no_candidate_skills') {
    return (
      <Link
        to="/profile"
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition"
        title="Add skills to your candidate profile to see match fit"
      >
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span>Add skills to see your match</span>
      </Link>
    );
  }

  const { score, label, breakdown, matchedSkills, missingSkills } = matchScore;

  const getStyle = () => {
    switch (label) {
      case 'Strong':
        return {
          container: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 shadow-xs',
          dot: 'bg-emerald-600',
          text: 'Strong Match',
        };
      case 'Good':
        return {
          container: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100 shadow-xs',
          dot: 'bg-indigo-600',
          text: 'Good Match',
        };
      case 'Low':
      default:
        return {
          container: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
          dot: 'bg-slate-400',
          text: 'Fair Match',
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition cursor-pointer select-none ${style.container}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        <span>{style.text}</span>
        <span className="font-extrabold text-[11px] opacity-90">({score}%)</span>
      </span>

      {/* Hover Tooltip showing percentage and fit breakdown */}
      {(showTooltip || showDetails) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3.5 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl z-50 text-xs pointer-events-none">
          <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-800">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>{label} Fit · {score}%</span>
            </span>
            <span className="text-[10px] text-indigo-300 font-medium">Rule-based</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Skills overlap (60%):</span>
              <b className="text-white">{breakdown?.skillsScore ?? 0}/60</b>
            </div>
            <div className="flex justify-between">
              <span>Role similarity (25%):</span>
              <b className="text-white">{breakdown?.roleScore ?? 0}/25</b>
            </div>
            <div className="flex justify-between">
              <span>Location / mode (15%):</span>
              <b className="text-white">{breakdown?.locationScore ?? 0}/15</b>
            </div>
          </div>

          {matchedSkills && matchedSkills.length > 0 && (
            <div className="mt-2.5 pt-1.5 border-t border-slate-800 text-[10px]">
              <span className="text-slate-400 block mb-0.5">Matched skills:</span>
              <span className="text-emerald-400 font-semibold">
                {matchedSkills.join(', ')}
              </span>
            </div>
          )}

          <div className="w-2.5 h-2.5 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-800" />
        </div>
      )}
    </div>
  );
}
