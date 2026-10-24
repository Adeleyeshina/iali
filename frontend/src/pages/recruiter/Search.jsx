import { useEffect, useState } from 'react';
import { Search, Lock, MapPin, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';
import MessageModal from '../../components/MessageModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

// Recruiter talent search and candidate discovery screen
export default function TalentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidatesList, setCandidatesList] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'open'
  const [noticeMessage, setNoticeMessage] = useState('');
  const [sentConversations, setSentConversations] = useState({});
  const [searching, setSearching] = useState(false);
  const [messageTarget, setMessageTarget] = useState(null);
  const toast = useToast();

  useEffect(() => {
    handleSearchCandidates();
  }, []);

  const handleSearchCandidates = async () => {
    try {
      setSearching(true);
      setNoticeMessage('');

      const res = await api(`/api/search/candidates?q=${encodeURIComponent(searchQuery.trim())}`);
      setCandidatesList(Array.isArray(res) ? res : res.candidates || []);
    } catch (err) {
      setNoticeMessage(err.message);
      setCandidatesList([]);
    } finally {
      setSearching(false);
    }
  };

  const filteredCandidates = (candidatesList || []).filter((cand) => {
    if (statusFilter === 'active') {
      return (cand.availability || '').toLowerCase().includes('actively');
    }
    if (statusFilter === 'open') {
      return (cand.availability || '').toLowerCase().includes('open');
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('actively')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Actively looking
        </span>
      );
    }
    if (lower.includes('open')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          Open to offers
        </span>
      );
    }
    if (lower.includes('not looking')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Employed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
        Exploring
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Find talent</h1>
        <Search className="w-5 h-5 text-zinc-700" />
      </div>
      <p className="text-xs md:text-sm text-zinc-500 mb-4">
        Verified companies only · candidate contact details stay protected · direct outreach.
      </p>

      {/* Search Bar & Filters */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs mb-5 space-y-3">
        <div className="flex gap-2">
          <input
            placeholder="Search by skill, role or city — e.g. React, Node.js, Lagos, Ibadan…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !searching && handleSearchCandidates()}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
          />
          <button
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5"
            onClick={handleSearchCandidates}
            disabled={searching}
          >
            <Search className="w-4 h-4" />
            <span>{searching ? 'Searching…' : 'Search'}</span>
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-semibold text-zinc-500 mr-1">Status:</span>
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-zinc-950 text-white border-zinc-950'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All Candidates
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'active'
                ? 'bg-zinc-950 text-white border-zinc-950'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            }`}
            onClick={() => setStatusFilter('active')}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Actively Looking
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'open'
                ? 'bg-zinc-950 text-white border-zinc-950'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            }`}
            onClick={() => setStatusFilter('open')}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Open to Offers
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs md:text-sm mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{noticeMessage} — complete company verification to unlock direct outreach.</span>
        </div>
      )}

      {searching && (
        <div className="space-y-3">
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      )}

      {!searching && filteredCandidates.length === 0 && !noticeMessage && (
        <EmptyState
          icon={Search}
          title="No candidates matched"
          hint="Try searching for a different skill or switch the status filter above."
        />
      )}

      {!searching && filteredCandidates.map((candidate) => (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-3.5" key={candidate.userId}>
          <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
            <div>
              <b className="text-base font-bold text-zinc-900 block">{candidate.headline || 'Software Professional'}</b>
              <p className="text-xs text-zinc-500 mt-1 mb-2 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{candidate.city || 'Nigeria'}</span>
                </span>
                <span>·</span>
                <span className="capitalize">Mode: {candidate.workModePref || 'remote'}</span>
                {candidate.willingRelocate && <span>· Open to relocate</span>}
              </p>
            </div>
            {getStatusBadge(candidate.availability)}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {(candidate.skills || []).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <div>
            {sentConversations[candidate.userId] ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Outreach message sent</span>
              </span>
            ) : (
              <button
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                onClick={() => setMessageTarget(candidate)}
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span>Message Candidate</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Message Candidate Modal */}
      <MessageModal
        isOpen={Boolean(messageTarget)}
        onClose={() => setMessageTarget(null)}
        candidate={messageTarget}
        onSuccess={() => {
          if (messageTarget) {
            setSentConversations((prev) => ({ ...prev, [messageTarget.userId]: true }));
          }
          toast.success('Outreach message sent to candidate!');
        }}
      />
    </div>
  );
}
