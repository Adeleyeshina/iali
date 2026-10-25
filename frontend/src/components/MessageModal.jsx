import { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { api } from '../lib/api.js';

// Modal for starting direct outreach conversation with a candidate
export default function MessageModal({ isOpen, onClose, candidate, onSuccess }) {
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !candidate) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setSending(true);
    setError('');

    try {
      await api('/api/conversations', {
        method: 'POST',
        body: {
          candidateId: candidate.userId || candidate.id,
          subject: subject.trim(),
        },
      });

      setSubject('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Message Candidate
          </h2>
          <MessageSquare className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-xs md:text-sm text-slate-500 mb-4">
          Direct outreach to <span className="font-bold text-slate-900">{candidate.name || candidate.headline || 'Candidate'}</span>.
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Role & Invitation Subject
            </label>
            <textarea
              rows="4"
              placeholder="e.g. Frontend Engineer @ PayTech Ltd — We came across your profile and would love to invite you for an interview..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !subject.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
            >
              <span>{sending ? 'Sending…' : 'Send Message'}</span>
              <Send className="w-3.5 h-3.5 text-coral-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
