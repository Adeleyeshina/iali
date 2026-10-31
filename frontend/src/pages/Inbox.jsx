import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Search,
  CheckCheck,
  Flag,
  ArrowLeft,
  Building2,
  User,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import ReportModal from '../components/ReportModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { copyToClipboard } from '../lib/clipboard.js';
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    scrollToBottom();
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
    // Backward compatibility for single subject messages
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

      // Build new message from server response
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
        // Clear draft query params
        setSearchParams({});
      }

      setTimeout(scrollToBottom, 100);
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
      {/* Header bar */}
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
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1.5">No conversations yet</h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mb-6">
            {isRecruiter
              ? 'Find verified candidates through Talent Search and send your first direct outreach message.'
              : 'When employers review your application and invite you for an interview, your messages will appear here.'}
          </p>
          {isRecruiter ? (
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              <span>Explore Candidate Talent</span>
            </Link>
          ) : (
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              <span>Explore Open Roles</span>
            </Link>
          )}
        </div>
      )}

      {/* Main Two-Panel Chat Interface */}
      {!loading && conversations?.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] h-[640px]">
          {/* LEFT PANEL: Conversation Thread List */}
          <div
            className={`border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50 ${
              activeConvId ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search conversations */}
            <div className="p-3.5 border-b border-slate-200/80 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search messages…"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition"
                />
              </div>
            </div>

            {/* Thread Cards */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const party = isRecruiter ? conv.candidate : conv.recruiter;
                const name = isRecruiter
                  ? party?.name || party?.email || 'Candidate'
                  : party?.memberships?.[0]?.company?.name || party?.name || 'Employer';
                const sub = isRecruiter
                  ? party?.profile?.headline || party?.headline || 'Job Seeker'
                  : party?.name || 'Recruiter';
                const latestMsg =
                  Array.isArray(conv.messages) && conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1].text
                    : conv.subject || 'Direct conversation';

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setSearchParams({});
                    }}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50/90 border-l-4 border-indigo-600 shadow-2xs'
                        : 'hover:bg-slate-100/60 bg-white'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {party?.profile?.photoUrl || party?.photoUrl ? (
                        <img
                          src={party?.profile?.photoUrl || party?.photoUrl}
                          alt=""
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-xs shadow-2xs border border-indigo-800/40">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-slate-900 truncate">{name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {new Date(conv.updatedAt || conv.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mb-1">{sub}</p>
                      <p
                        className={`text-xs truncate ${
                          isActive ? 'text-indigo-950 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {latestMsg}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: The Active Chat Window */}
          {activeConversation ? (
            <div className="flex flex-col h-full bg-slate-50/30">
              {/* CHAT HEADER */}
              <div className="px-5 py-3.5 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    {otherParty.photoUrl ? (
                      <img
                        src={otherParty.photoUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-xs shadow-2xs border border-indigo-800/40">
                        {otherParty.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 animate-pulse" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <b className="text-sm font-bold text-slate-900 truncate">{otherParty.name}</b>
                      {otherParty.isRecruiter ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Employer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-950 border border-indigo-200/60">
                          <span>Candidate</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {otherParty.headline}
                    </span>
                  </div>
                </div>

                {/* Chat Top Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        activeMessages.map((m) => m.text).join('\n---\n'),
                        'Chat transcript copied to clipboard!'
                      )
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="Copy full transcript"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReportTarget({
                        targetId: activeConversation.id,
                        targetTitle: `Chat with ${otherParty.name}`,
                      })
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Report conversation"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MESSAGES BUBBLE STREAM */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Channel banner pill */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-2xs">
                    Direct Outreach Channel · End-to-End Logged
                  </span>
                </div>

                {activeMessages.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No messages yet. Send your first message below!
                  </div>
                )}

                {activeMessages.map((msg) => {
                  const currentUserId = user?.id;
                  const isSender =
                    msg.senderId === currentUserId ||
                    (isRecruiter && msg.senderRole === 'recruiter') ||
                    (!isRecruiter && msg.senderRole === 'candidate');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                        {!isSender && (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mb-1">
                            {otherParty.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div
                          className={`p-4 rounded-2xl shadow-xs transition-all text-sm leading-relaxed whitespace-pre-line ${
                            isSender
                              ? 'bg-gradient-brand text-white rounded-tr-xs shadow-md shadow-indigo-500/15'
                              : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                          }`}
                        >
                          {msg.text}

                          {/* Message metadata / timestamp */}
                          <div
                            className={`flex items-center gap-1 text-[10px] mt-1.5 font-medium ${
                              isSender ? 'text-indigo-200 justify-end' : 'text-slate-400 justify-start'
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isSender && <CheckCheck className="w-3.5 h-3.5 text-coral-300" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* CHAT INPUT BAR */}
              <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/90">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-slate-100/90 rounded-2xl p-1.5 border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/15 transition"
                >
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Reply to ${otherParty.name}… (Press Enter to send)`}
                    disabled={sending}
                    className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    <span>{sending ? 'Sending…' : 'Send'}</span>
                    <Send className="w-3.5 h-3.5 text-coral-300" />
                  </button>
                </form>
              </div>
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
