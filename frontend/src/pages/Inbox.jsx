import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';
import ReportModal from '../components/ReportModal.jsx';
import ConversationSidebar from '../components/inbox/ConversationSidebar.jsx';
import ChatHeader from '../components/inbox/ChatHeader.jsx';
import MessageList from '../components/inbox/MessageList.jsx';
import ChatInput from '../components/inbox/ChatInput.jsx';
import InboxEmptyState from '../components/inbox/InboxEmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Inbox({ user: propUser }) {
  const auth = useAuth();
  const user = propUser !== undefined ? propUser : auth.user;
  const isRecruiter = user?.role === 'recruiter';
  const toast = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const targetCandidateId = searchParams.get('candidateId') || searchParams.get('userId');
  const targetName = searchParams.get('name');

  const [conversations, setConversations] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportTarget, setReportTarget] = useState(null);

  const messagesContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'auto') => {
    const el = messagesContainerRef.current;
    if (el) {
      if (behavior === 'smooth') {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    }
  };

  const loadConversations = async (autoSelectCandidateId = targetCandidateId) => {
    try {
      setLoading(true);
      const data = await api('/api/conversations');
      const convList = Array.isArray(data) ? data : [];
      setConversations(convList);

      // Auto-select or initialize if opened with ?candidateId=...
      if (autoSelectCandidateId) {
        const found = convList.find(
          (c) => c.candidateId === autoSelectCandidateId || c.recruiterId === autoSelectCandidateId
        );
        if (found) {
          setActiveConvId(found.id);
        } else {
          // If no thread exists yet with this candidate/user, create an active draft
          const draftId = 'draft-' + autoSelectCandidateId;
          const draftConv = {
            id: draftId,
            candidateId: autoSelectCandidateId,
            recruiterId: user?.id,
            isDraft: true,
            candidate: {
              id: autoSelectCandidateId,
              name: targetName || 'Candidate',
              headline: 'Job Seeker',
              photoUrl: null,
            },
            recruiter: {
              id: user?.id,
              name: user?.name || 'Recruiter',
              memberships: user?.companyName ? [{ company: { name: user.companyName } }] : [],
            },
            messages: [],
            updatedAt: new Date().toISOString(),
          };
          setConversations([draftConv, ...convList]);
          setActiveConvId(draftId);
        }
      } else if (convList.length > 0 && !activeConvId) {
        setActiveConvId(convList[0].id);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [targetCandidateId]);

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeConvId, conversations]);

  const activeConversation = useMemo(() => {
    if (!conversations || !activeConvId) return null;
    return conversations.find((c) => c.id === activeConvId) || conversations[0] || null;
  }, [conversations, activeConvId]);

  // Extract normalized messages list for the active conversation
  const activeMessages = useMemo(() => {
    if (!activeConversation) return [];
    if (Array.isArray(activeConversation.messages) && activeConversation.messages.length > 0) {
      return activeConversation.messages;
    }
    if (activeConversation.subject) {
      return [
        {
          id: 'init-msg-' + activeConversation.id,
          senderId: activeConversation.recruiterId,
          senderRole: 'recruiter',
          text: activeConversation.subject,
          createdAt: activeConversation.createdAt,
        },
      ];
    }
    return [];
  }, [activeConversation]);

  // Determine other party details for the active conversation
  const otherParty = useMemo(() => {
    if (!activeConversation) return { name: 'Direct Outreach', headline: '', company: '' };
    if (isRecruiter) {
      const c = activeConversation.candidate || {};
      const profile = c.profile || {};
      return {
        id: activeConversation.candidateId,
        name: c.name || c.email || targetName || 'Candidate',
        headline: profile.headline || 'Job Seeker',
        company: 'Candidate',
        photoUrl: profile.photoUrl || c.photoUrl || null,
        isRecruiter: false,
      };
    } else {
      const r = activeConversation.recruiter || {};
      const companyName = r.memberships?.[0]?.company?.name || r.companyName || 'Verified Employer';
      return {
        id: activeConversation.recruiterId,
        name: r.name || companyName,
        headline: companyName,
        company: companyName,
        photoUrl: null,
        isRecruiter: true,
      };
    }
  }, [activeConversation, isRecruiter, targetName]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || !activeConversation || sending) return;

    try {
      setSending(true);
      const isDraft = activeConversation.isDraft;

      const payload = {
        recipientId: isRecruiter ? activeConversation.candidateId : activeConversation.recruiterId,
        candidateId: activeConversation.candidateId,
        recruiterId: activeConversation.recruiterId,
        message: trimmed,
        subject: trimmed,
      };

      const res = await api('/api/conversations', {
        method: 'POST',
        body: payload,
      });

      setMessageText('');

      const createdConv = res.conversation || res;
      const newMsg = {
        id: createdConv?.id || 'msg-' + Date.now(),
        senderId: user?.id,
        senderRole: user?.role || (isRecruiter ? 'recruiter' : 'candidate'),
        text: trimmed,
        createdAt: createdConv?.createdAt || new Date().toISOString(),
      };

      setConversations((prev) => {
        if (!prev) return [createdConv];
        return prev.map((c) => {
          if (c.id === activeConversation.id) {
            const currentMsgs = Array.isArray(c.messages) ? c.messages : [];
            return {
              ...c,
              id: createdConv?.id || c.id,
              isDraft: false,
              messages: [...currentMsgs, newMsg],
              updatedAt: new Date().toISOString(),
              subject: trimmed,
            };
          }
          return c;
        });
      });

      if (isDraft && createdConv?.id) {
        setActiveConvId(createdConv.id);
        setSearchParams({});
      }

      setTimeout(() => scrollToBottom('smooth'), 50);
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!filterQuery.trim()) return conversations;
    const q = filterQuery.toLowerCase();
    return conversations.filter((c) => {
      const party = isRecruiter ? c.candidate : c.recruiter;
      const name = (party?.name || '').toLowerCase();
      const comp = (party?.memberships?.[0]?.company?.name || '').toLowerCase();
      const sub = (c.subject || '').toLowerCase();
      return name.includes(q) || comp.includes(q) || sub.includes(q);
    });
  }, [conversations, filterQuery, isRecruiter]);

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Messages & Direct Outreach
            </h1>
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Real-time direct chat between verified employers and candidate talent.
          </p>
        </div>

        {isRecruiter && (
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs self-start sm:self-auto"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search More Talent</span>
          </Link>
        )}
      </div>

      {loading && (
        <div className="h-[580px] bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading your conversations…</span>
          </div>
        </div>
      )}

      {!loading && conversations?.length === 0 && (
        <InboxEmptyState isRecruiter={isRecruiter} />
      )}

      {/* Main Two-Panel Chat Interface */}
      {!loading && conversations?.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] h-[calc(100vh-170px)] min-h-[560px] max-h-[760px]">
          {/* LEFT PANEL: Conversation Thread List */}
          <ConversationSidebar
            conversations={filteredConversations}
            activeConvId={activeConvId}
            onSelectConv={(id) => {
              setActiveConvId(id);
              setSearchParams({});
            }}
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
            isRecruiter={isRecruiter}
          />

          {/* RIGHT PANEL: The Active Chat Window */}
          {activeConversation ? (
            <div className="flex flex-col h-full min-h-0 overflow-hidden bg-slate-50/30">
              <ChatHeader
                otherParty={otherParty}
                activeMessages={activeMessages}
                onBack={() => setActiveConvId(null)}
                onReport={() =>
                  setReportTarget({
                    targetId: activeConversation.id,
                    targetTitle: `Chat with ${otherParty.name}`,
                  })
                }
              />

              <MessageList
                activeMessages={activeMessages}
                otherParty={otherParty}
                currentUserId={user?.id}
                isRecruiter={isRecruiter}
                containerRef={messagesContainerRef}
              />

              <ChatInput
                messageText={messageText}
                setMessageText={setMessageText}
                onSendMessage={handleSendMessage}
                sending={sending}
                recipientName={otherParty.name}
              />
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50/20">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetType="conversation"
        targetId={reportTarget?.targetId}
        targetTitle={reportTarget?.targetTitle}
      />
    </div>
  );
}
