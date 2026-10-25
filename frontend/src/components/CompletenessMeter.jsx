import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

export default function CompletenessMeter({
  completeness,
  compact = false,
  showBreakdownToggle = true,
  onActionClick,
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!completeness) return null;

  const score = completeness.score ?? 0;
  const isComplete = score >= 80;
  const nextAction = completeness.nextAction || {
    text: 'Keep your profile complete for recruiters.',
    targetScore: score,
  };

  const getMeterColor = (val) => {
    if (val >= 80) return 'from-emerald-500 to-teal-500';
    if (val >= 50) return 'from-indigo-600 to-indigo-500';
    return 'from-slate-400 to-slate-500';
  };

  const getBadgeStyle = (val) => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (val >= 50) return 'bg-indigo-50 text-indigo-900 border-indigo-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const items = [
    { label: 'Basic Info (Name, City, Role)', weight: 15, current: completeness.breakdown?.basicInfo ?? 0 },
    { label: 'Skills (at least 5)', weight: 20, current: completeness.breakdown?.skills ?? 0 },
    { label: 'Work Experience', weight: 20, current: completeness.breakdown?.experience ?? 0 },
    { label: 'CV Uploaded', weight: 20, current: completeness.breakdown?.cv ?? 0 },
    { label: 'Education', weight: 10, current: completeness.breakdown?.education ?? 0 },
    { label: 'Short Bio', weight: 10, current: completeness.breakdown?.bio ?? 0 },
    { label: 'Profile Photo', weight: 5, current: completeness.breakdown?.photo ?? 0 },
  ];

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Profile Completeness
            </span>
            <span className="text-xs font-extrabold text-white px-2 py-0.5 rounded-full bg-white/20">
              {score}%
            </span>
          </div>
          {isComplete ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Talent Pool Ready</span>
            </span>
          ) : (
            <Link
              to="/profile"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 hover:text-white underline"
            >
              <span>Boost profile</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getMeterColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-indigo-100">
          <p className="m-0 flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-coral-400 shrink-0" />
            <span className="truncate">{nextAction.text}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 m-0">Profile Completeness Meter</h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(
                score
              )}`}
            >
              {score}% Complete
            </span>
          </div>
          <p className="text-xs text-slate-500 m-0">
            Full profiles get up to 4x more outreach from verified recruiters in the talent pool.
          </p>
        </div>

        {showBreakdownToggle && (
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 transition cursor-pointer"
          >
            <span>{showBreakdown ? 'Hide details' : 'View checklist'}</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getMeterColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-coral-500" />
          </span>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Next Best Action
            </span>
            <p className="text-xs font-semibold text-slate-900 m-0 truncate">
              {nextAction.text}
            </p>
          </div>
        </div>

        {score < 100 && (
          <button
            type="button"
            onClick={() => onActionClick && onActionClick(nextAction.actionKey)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-slate-900 text-white text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span>Complete now</span>
            <ArrowRight className="w-3 h-3 text-indigo-300" />
          </button>
        )}
      </div>

      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item) => {
            const isDone = item.current >= item.weight;
            return (
              <div
                key={item.label}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200/60 text-emerald-900'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-300 shrink-0" />
                  )}
                  <span className="font-medium truncate">{item.label}</span>
                </div>
                <span className="font-bold text-[11px] shrink-0">
                  {item.current} / {item.weight}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
