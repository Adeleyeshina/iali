import { X, AlertTriangle, HelpCircle } from 'lucide-react';

// Reusable confirmation modal replacing native browser confirm/alert dialogs
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Please Confirm',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 md:p-7 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isDanger ? 'bg-rose-50 text-rose-600' : 'bg-zinc-100 text-zinc-900'
            }`}
          >
            {isDanger ? <AlertTriangle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
          </div>
          <div className="pr-6">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 m-0 mb-1">{title}</h2>
            <p className="text-xs md:text-sm text-zinc-500 m-0 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-zinc-900 hover:bg-black'
            }`}
          >
            <span>{loading ? 'Processing…' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
