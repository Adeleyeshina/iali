import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState.jsx';
import ApplicationTimelineModal from '../../components/ApplicationTimelineModal.jsx';
import JobApplicantsHeader from '../../components/recruiter/JobApplicantsHeader.jsx';
import ApplicantsStageFilter from '../../components/recruiter/ApplicantsStageFilter.jsx';
import ApplicantItemRow from '../../components/recruiter/ApplicantItemRow.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';
import { calculateMatchScore } from '../../lib/matchScore.js';

// Recruiter applicant management pipeline
export default function JobApplicants() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState(null);
  const [activeStage, setActiveStage] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [messageCandidate, setMessageCandidate] = useState(null);
  const [timelineTarget, setTimelineTarget] = useState(null);
  const toast = useToast();

  const loadData = () => {
    setLoading(true);
    api(`/api/jobs/${jobId}/applications`)
      .then((res) => {
        setJob(res.job);
        setApplications(res.applications || []);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load applicants');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [jobId]);

  const handleUpdateStatus = async (appId, newStatus, rejected = false) => {
    try {
      setUpdatingId(appId);
      await api(`/api/jobs/applications/${appId}/status`, {
        method: 'PATCH',
        body: { status: newStatus, rejected },
      });
      toast.success(`Application updated to ${rejected ? 'Rejected' : newStatus}`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = useMemo(() => {
    if (!applications) return [];

    let list = applications.filter((app) => {
      if (activeStage === 'All') return true;
      return app.status === activeStage && !app.rejected;
    });

    return list.sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = a.matchScore?.score ?? (calculateMatchScore(job, a.candidate?.profile).score ?? -1);
        const scoreB = b.matchScore?.score ?? (calculateMatchScore(job, b.candidate?.profile).score ?? -1);
        return scoreB - scoreA;
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [applications, activeStage, sortBy, job]);

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-4">
      <JobApplicantsHeader
        job={job}
        applicantsCount={applications ? applications.length : 0}
      />

      <ApplicantsStageFilter
        activeStage={activeStage}
        setActiveStage={setActiveStage}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <div className="space-y-3">
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          title="No candidates in this stage"
          description="Candidates who apply or get shortlisted to this status will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <ApplicantItemRow
              key={app.id}
              app={app}
              onOpenTimeline={(target) => setTimelineTarget(target)}
              onOpenMessage={(cand) => {
                const targetId = cand.id || cand.userId || app.candidateId;
                const targetName = encodeURIComponent(cand.name || '');
                navigate(`/inbox?candidateId=${targetId}&name=${targetName}`);
              }}
              onUpdateStatus={handleUpdateStatus}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}

      {timelineTarget && (
        <ApplicationTimelineModal
          application={timelineTarget}
          onClose={() => setTimelineTarget(null)}
        />
      )}
    </div>
  );
}
