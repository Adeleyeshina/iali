import { ArrowRight } from 'lucide-react';
import SkillTagInput from '../SkillTagInput.jsx';
import { NIGERIAN_CITIES } from '../../data/launchAreas.js';

// Form inputs for creating a new job role
export default function PostJobForm({
  formData,
  setFormData,
  onSubmit,
  posting,
  errorMessage,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
          Job Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Lead Frontend Engineer"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Work Mode *
          </label>
          <select
            value={formData.workMode}
            onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer capitalize shadow-xs"
          >
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote (Nationwide)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            City / State / Location *
          </label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer shadow-xs"
          >
            {NIGERIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Required Tech Stack & Skills
        </label>
        <SkillTagInput
          skills={formData.requiredSkills || []}
          onChange={(newSkills) => setFormData({ ...formData, requiredSkills: newSkills })}
          placeholder="Add required skill (e.g. React, PostgreSQL) and press Enter…"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Hiring Entity / Client Name <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Fintech Subsidiary or Stealth Startup"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Job Description & Requirements *
        </label>
        <textarea
          rows="6"
          placeholder="Describe key responsibilities, deliverables, and requirements…"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition resize-none shadow-xs"
        />
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={posting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-sm font-bold transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{posting ? 'Publishing job role…' : 'Publish Job Opening'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
