import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import SkillTagInput from '../../SkillTagInput.jsx';
import { NIGERIAN_CITIES } from '../../../data/launchAreas.js';

// Step 2: Review and edit parsed candidate profile data
export default function OnboardingReviewStep({
  parsedResult,
  setParsedResult,
  onBack,
  onSave,
  saving,
}) {
  const parsed = parsedResult?.parsed || {};

  const handleFieldChange = (field, val) => {
    setParsedResult({
      ...parsedResult,
      parsed: {
        ...parsed,
        [field]: val,
      },
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs font-medium">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Resume extracted successfully! Review your details below before confirming.</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Role Headline
          </label>
          <input
            type="text"
            value={parsed.headline || ''}
            onChange={(e) => handleFieldChange('headline', e.target.value)}
            placeholder="e.g. Senior Frontend Engineer · React & Next.js"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Location / State
          </label>
          <select
            value={parsed.city || 'Lagos'}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer shadow-xs"
          >
            {NIGERIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Extracted Skills
          </label>
          <SkillTagInput
            skills={parsed.skills || []}
            onChange={(newSkills) => handleFieldChange('skills', newSkills)}
            placeholder="Add or remove skills…"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Professional Summary
          </label>
          <textarea
            rows="4"
            value={parsed.summary || ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition resize-none shadow-xs"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload different CV</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? 'Saving to Profile…' : 'Save & View Profile'}</span>
        </button>
      </div>
    </div>
  );
}
