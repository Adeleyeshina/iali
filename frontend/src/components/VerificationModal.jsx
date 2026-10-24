import { useState } from 'react';
import { X, ShieldCheck, Award, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

// Modal for submitting company CAC and CIPM HR verification
export default function VerificationModal({ isOpen, onClose, onSuccess }) {
  const [tab, setTab] = useState('CAC'); // 'CAC' | 'CIPM'
  const [cacNumber, setCacNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api('/api/verifications/request', {
        method: 'POST',
        body: {
          type: tab,
          cacNumber: tab === 'CAC' ? cacNumber.trim() : undefined,
          website: tab === 'CAC' ? website.trim() : undefined,
          membershipNumber: tab === 'CIPM' ? membershipNumber.trim() : undefined,
          notes: notes.trim(),
        },
      });

      toast.success(
        tab === 'CAC'
          ? 'CAC verification request submitted! Review is typically completed in 24 hours.'
          : 'CIPM membership credentials submitted for professional badge review.'
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit verification request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-1">
          Apply for Trust Badges
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 mb-4">
          Verified accounts unlock direct candidate messaging and high-trust status.
        </p>

        {/* Tab selection */}
        <div className="flex gap-2 mb-4 p-1 bg-zinc-100 rounded-xl">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'CAC' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
            onClick={() => setTab('CAC')}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Company CAC (L2)</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'CIPM' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
            onClick={() => setTab('CIPM')}
          >
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>CIPM HR Badge</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'CAC' ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  CAC Registration Number *
                </label>
                <input
                  placeholder="e.g. RC 1492049 or BN 2938472"
                  value={cacNumber}
                  onChange={(e) => setCacNumber(e.target.value)}
                  disabled={submitting}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Company Official Website *
                </label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={submitting}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                CIPM Membership ID / Number *
              </label>
              <input
                placeholder="e.g. ACIPM/2023/1842 or MCIPM/1092"
                value={membershipNumber}
                onChange={(e) => setMembershipNumber(e.target.value)}
                disabled={submitting}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                For Chartered Institute of Personnel Management members and HR associates.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="LinkedIn company page, corporate phone, or registered office address..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting…' : 'Submit for Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
