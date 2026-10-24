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
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Message Candidate
          </h2>
          <MessageSquare className="w-5 h-5 text-zinc-700" />
        </div>
        <p className="text-xs md:text-sm text-zinc-500 mb-4">
          Direct outreach to <span className="font-semibold text-zinc-900">{candidate.name || candidate.headline || 'Candidate'}</span>.
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Role & Invitation Subject
            </label>
            <textarea
              rows="4"
              placeholder="e.g. Frontend Engineer @ PayTech Ltd — We came across your profile and would love to invite you for an interview..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !subject.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{sending ? 'Sending…' : 'Send Message'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
