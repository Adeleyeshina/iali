import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';
import TalentSearchFilters from '../../components/recruiter/TalentSearchFilters.jsx';
import TalentCandidateCard from '../../components/recruiter/TalentCandidateCard.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { api } from '../../lib/api.js';

// Recruiter talent search and candidate discovery screen
export default function TalentSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [candidatesList, setCandidatesList] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [completeOnly, setCompleteOnly] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [sentConversations, setSentConversations] = useState({});
  const [searching, setSearching] = useState(false);
  const toast = useToast();

  const handleSearchCandidates = async (queryText = searchQuery) => {
    try {
      setSearching(true);
      setNoticeMessage('');

      const queryParams = new URLSearchParams({
        q: (queryText || '').trim(),
        completeOnly: String(completeOnly),
      });

      const res = await api(`/api/search/candidates?${queryParams.toString()}`);
      setCandidatesList(Array.isArray(res) ? res : res.candidates || []);
    } catch (err) {
      setNoticeMessage(err.message);
      setCandidatesList([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    handleSearchCandidates(debouncedQuery);
  }, [debouncedQuery, completeOnly]);

  const filteredCandidates = useMemo(() => {
    if (!candidatesList) return [];
    return candidatesList.filter((cand) => {
      if (statusFilter === 'active') {
        return (cand.availability || '').toLowerCase().includes('actively');
      }
      if (statusFilter === 'open') {
        return (cand.availability || '').toLowerCase().includes('open');
      }
      return true;
    });
  }, [candidatesList, statusFilter]);

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Find Vetted Talent</h1>
          <Search className="w-5 h-5 text-zinc-700" />
        </div>
        <p className="text-xs md:text-sm text-zinc-500">
          Direct candidate outreach · candidate contact details stay protected until matched.
        </p>
      </div>

      <TalentSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={(e) => {
          if (e?.preventDefault) e.preventDefault();
          handleSearchCandidates(searchQuery);
        }}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        completeOnly={completeOnly}
        setCompleteOnly={setCompleteOnly}
        searching={searching}
      />

      {searching ? (
        <div className="space-y-3">
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      ) : filteredCandidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Try broadening your search term or unchecking the complete profiles filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredCandidates.map((cand) => (
            <TalentCandidateCard
              key={cand.id || cand.userId}
              cand={cand}
              onOpenMessage={(target) => {
                const targetId = target.id || target.userId;
                const targetName = encodeURIComponent(target.name || '');
                navigate(`/inbox?candidateId=${targetId}&name=${targetName}`);
              }}
              hasMessaged={Boolean(sentConversations[cand.id || cand.userId])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
