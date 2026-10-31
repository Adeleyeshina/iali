import { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

export default function DeleteJobModal({ isOpen, onClose, job, onJobDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();

  if (!isOpen || !job) return null;

  const applicantCount = job._count?.applications || 0;

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setErrorMessage('');

    try {
      await api(`/api/jobs/${job.id}`, {
        method: 'DELETE',
      });

      toast.success(`"${job.title}" was permanently deleted.`);
      if (onJobDeleted) {
        onJobDeleted(job.id);
      }
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to delete job post';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Delete Job Listing
            </h2>
            <p className="text-xs text-zinc-500">
              Permanent action · Irreversible
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs my-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Are you sure you want to delete <span className="underline font-bold">"{job.title}"</span>?
            </p>
            <p className="text-amber-800">
              This will remove the job from public listings and permanently delete{' '}
              <strong className="font-semibold">{applicantCount}</strong> associated candidate application{applicantCount === 1 ? '' : 's'}.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 transition cursor-pointer"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
          >
            {deleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Job</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
