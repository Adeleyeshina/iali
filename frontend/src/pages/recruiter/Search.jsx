import { useState } from 'react';
import EmptyState from '../../components/EmptyState.jsx';
import { api } from '../../lib/api.js';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidatesList, setCandidatesList] = useState(null);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [sentConversations, setSentConversations] = useState({});
  const [searching, setSearching] = useState(false);
  const [messagingCandidateId, setMessagingCandidateId] = useState(null);

  const handleSearchCandidates = async () => {
    try {
      setSearching(true);
      setNoticeMessage('');
      setCandidatesList(null);

      const res = await api(`/api/search/candidates?q=${encodeURIComponent(searchQuery.trim())}`);
      setCandidatesList(Array.isArray(res) ? res : res.candidates || []);
    } catch (err) {
      setNoticeMessage(err.message);
      setCandidatesList([]);
    } finally {
      setSearching(false);
    }
  };

  const handleContactCandidate = async (candidateId) => {
    const subject = prompt('First message — role + company required (e.g. Frontend Dev @ TechStartup Ltd):');
    if (!subject) return;

    try {
      setMessagingCandidateId(candidateId);
      await api('/api/conversations', {
        method: 'POST',
        body: { candidateId, subject },
      });
      setSentConversations((prev) => ({ ...prev, [candidateId]: true }));
    } catch (err) {
      alert(err.message);
    } finally {
      setMessagingCandidateId(null);
    }
  };

  return (
    <div>
      <h2 style={{ letterSpacing: '-0.5px', marginBottom: 2 }}>Find talent 🔍</h2>
      <p className="mut">
        Verified companies only · contact details stay hidden · outreach happens inside Iali.
      </p>

      <div className="card" style={{ padding: 12 }}>
        <input
          placeholder="Skill, headline or city — e.g. React, Lagos…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !searching && handleSearchCandidates()}
        />

        <button
          className="btn block"
          onClick={handleSearchCandidates}
          disabled={searching}
        >
          {searching ? 'Searching candidates…' : 'Search candidates'}
        </button>
      </div>

      {noticeMessage && (
        <div className="card">
          🔒 {noticeMessage} — complete verification to unlock search + messaging.
        </div>
      )}

      {!candidatesList && !noticeMessage && (
        <EmptyState
          icon="✨"
          title="Shortlist in minutes"
          hint="Search react, filter Lagos, message the best — daily limits + contact prefs keep it spam-free."
        />
      )}

      {(candidatesList || []).map((candidate) => (
        <div className="card" key={candidate.userId}>
          <b>{candidate.headline || 'Candidate'}</b>

          <p className="mut" style={{ margin: '4px 0' }}>
            {(candidate.skills || []).join(' · ') || 'Skills not listed'} · 📍 {candidate.city || '—'} ·{' '}
            {candidate.availability || ''}
          </p>

          <div className="tagrow">
            <span className="badge">{candidate.workModePref || 'remote'}</span>
            {candidate.willingRelocate && <span className="badge">open to relocate</span>}
          </div>

          <div style={{ marginTop: 10 }}>
            {sentConversations[candidate.userId] ? (
              <span className="badge">✓ Message sent</span>
            ) : (
              <button
                className="btn sm"
                onClick={() => handleContactCandidate(candidate.userId)}
                disabled={messagingCandidateId === candidate.userId}
              >
                {messagingCandidateId === candidate.userId ? 'Sending…' : 'Message →'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
