import { useEffect, useState } from 'react';
import { MessageSquare, Copy, Flag, Send } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import MessageModal from '../components/MessageModal.jsx';
import ReportModal from '../components/ReportModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { copyToClipboard } from '../lib/clipboard.js';
import { api } from '../lib/api.js';

import { useAuth } from '../context/AuthContext.jsx';

// Messages and direct outreach screen
export default function Inbox({ user: propUser }) {
  const auth = useAuth();
  const user = propUser !== undefined ? propUser : auth.user;
  const [conversations, setConversations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const toast = useToast();

  const loadConversations = () => {
    setLoading(true);
    api('/api/conversations')
      .then((data) => setConversations(data || []))
      .catch((err) => {
        toast.error(err.message || 'Failed to load messages');
        setConversations([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="max-w-[1120px] mx-auto my-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Messages & Outreach</h1>
          <MessageSquare className="w-5 h-5 text-zinc-700" />
        </div>
        <p className="text-xs md:text-sm text-zinc-500">
          Direct communication between verified employers and candidates.
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      )}

      {!loading && conversations?.length === 0 && (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          hint={
            isRecruiter
              ? 'Search talent and send direct outreach messages to candidates.'
              : 'When employers find your profile and send an interview invitation, it will appear here.'
          }
        />
      )}

      {!loading && conversations?.length > 0 && (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const otherParty = isRecruiter ? conv.candidate : conv.recruiter;
            const companyName = conv.recruiter?.memberships?.[0]?.company?.name || 'Verified Employer';
            const displayName = isRecruiter ? otherParty?.name || otherParty?.email : companyName;

            return (
              <div
                key={conv.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <b className="text-base font-bold text-slate-900">{displayName}</b>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-950 border border-indigo-200/60">
                      {isRecruiter ? 'Candidate' : 'Employer'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2">
                    {new Date(conv.createdAt).toLocaleDateString()} at{' '}
                    {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs md:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {conv.subject}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-start flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => copyToClipboard(conv.subject, 'Message copied to clipboard!')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer flex items-center gap-1"
                    title="Copy message content"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() =>
                      setReportTarget({
                        targetId: conv.id,
                        targetTitle: `Conversation with ${displayName}`,
                      })
                    }
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition cursor-pointer"
                    title="Report recruiter or abuse"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setReplyTarget({
                        userId: isRecruiter ? conv.candidateId : conv.recruiterId,
                        name: displayName,
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Reply</span>
                    <Send className="w-3 h-3 text-coral-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      <MessageModal
        isOpen={Boolean(replyTarget)}
        onClose={() => setReplyTarget(null)}
        candidate={replyTarget}
        onSuccess={() => {
          toast.success('Reply sent successfully!');
          loadConversations();
        }}
      />

      {/* Safety Report Modal */}
      <ReportModal
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetType="recruiter"
        targetId={reportTarget?.targetId}
        targetTitle={reportTarget?.targetTitle}
      />
    </div>
  );
}
