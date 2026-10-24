import { useState } from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

const REPORT_REASONS = [
  'Asking for application, training, or registration fee (Strictly prohibited)',
  'Suspected scam or fake company profile',
  'Asking for bank details or BVN/NIN before interview',
  'Misleading job description or deceptive offer',
  'Inappropriate or abusive communication',
  'Other',
];

// Safety reporting modal component with custom reason option
export default function ReportModal({ isOpen, onClose, targetType = 'job', targetId, targetTitle }) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const isOther = reason === 'Other';
  const effectiveReason = isOther ? customReason.trim() : reason;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOther && !customReason.trim()) {
      toast.error('Please specify your custom reason.');
      return;
    }

    setSubmitting(true);

    try {
      await api('/api/reports', {
        method: 'POST',
        body: {
          targetType,
          targetId,
          reason: effectiveReason,
          details: details.trim(),
        },
      });

      toast.success('Report submitted. Our safety team has been alerted.');
      setCustomReason('');
      setDetails('');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
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

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Report {targetType === 'job' ? 'Job Listing' : 'Recruiter'}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-zinc-500 mb-4">
          Reporting <span className="font-semibold text-zinc-900">{targetTitle || targetId}</span>. All scam and fee reports are acted upon immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Reason for report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 transition cursor-pointer"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Custom reason input shown when Other is selected */}
          {isOther && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Specify your reason *
              </label>
              <input
                type="text"
                placeholder="e.g. Asking for money for training materials, ghost job..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={submitting}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Provide any specific details or quotes (e.g. they requested ₦5,000 for training forms via WhatsApp)..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
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
              disabled={submitting || (isOther && !customReason.trim())}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting…' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
