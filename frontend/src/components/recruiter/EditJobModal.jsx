import { useState, useEffect } from 'react';
import { X, Edit3, Check, Loader2, Info } from 'lucide-react';
import SkillTagInput from '../SkillTagInput.jsx';
import { NIGERIAN_CITIES } from '../../data/launchAreas.js';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

export default function EditJobModal({ isOpen, onClose, job, onJobUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workMode: 'onsite',
    city: 'Lagos',
    clientName: '',
    requiredSkills: [],
    status: 'Live',
  });
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        workMode: job.workMode || 'onsite',
        city: job.city || 'Lagos',
        clientName: job.clientName || '',
        requiredSkills: Array.isArray(job.requiredSkills) ? [...job.requiredSkills] : [],
        status: job.status || 'Live',
      });
      setErrorMessage('');
    }
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!formData.title.trim()) {
      setErrorMessage('Job title is required.');
      return;
    }

    if (formData.description.trim().length < 10) {
      setErrorMessage('Description must be at least 10 characters long.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        workMode: formData.workMode,
        city: formData.workMode === 'remote' ? null : formData.city,
        clientName: formData.clientName.trim() || null,
        requiredSkills: formData.requiredSkills,
        status: formData.status,
      };

      const updatedJob = await api(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        body: payload,
      });

      if (formData.status === 'Closed' && job.status !== 'Closed') {
        toast.success('Job closed and removed from public listings.');
      } else {
        toast.success('Job listing updated successfully!');
      }

      if (onJobUpdated) {
        onJobUpdated(updatedJob);
      }
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to update job post';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Edit Job Listing
          </h2>
        </div>

        <p className="text-xs md:text-sm text-zinc-500 mb-5">
          Update the details, hiring status, or requirements for this role.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
            />
          </div>

          {/* Job Status Selection with Clear Visual Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Listing Status *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Live' })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  formData.status === 'Live'
                    ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Live
                  </span>
                  {formData.status === 'Live' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-emerald-800/80 leading-tight">
                  Visible to candidates & accepting applications.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Closed' })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  formData.status === 'Closed'
                    ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    Closed
                  </span>
                  {formData.status === 'Closed' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </div>
                <span className="text-[11px] text-rose-800/80 leading-tight">
                  Hiring finished. Hidden from public searches.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Pending Review' })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  formData.status === 'Pending Review'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Pending Review
                  </span>
                  {formData.status === 'Pending Review' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <span className="text-[11px] text-amber-800/80 leading-tight">
                  Draft or internal review stage.
                </span>
              </button>
            </div>
            {formData.status === 'Closed' && (
              <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Closing this role prevents new candidate applications and hides it from the job board.</span>
              </p>
            )}
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
                Location {formData.workMode === 'remote' ? '(Nationwide)' : '*'}
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={formData.workMode === 'remote'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 shadow-xs"
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
              placeholder="Add skill (e.g. React, Node.js, SQL) and press Enter…"
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
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 transition cursor-pointer"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes…</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-coral-300" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
