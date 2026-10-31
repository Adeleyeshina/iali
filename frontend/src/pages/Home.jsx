import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CvDropModal from '../components/CvDropModal.jsx';
import CompletenessMeter from '../components/CompletenessMeter.jsx';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard.jsx';
import CandidateDashboardHero from '../components/dashboard/CandidateDashboardHero.jsx';
import CandidateQuickActions from '../components/dashboard/CandidateQuickActions.jsx';
import JobsFeedSection from '../components/dashboard/JobsFeedSection.jsx';
import { toast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSavedJobs } from '../context/SavedJobsContext.jsx';
import { api } from '../lib/api.js';

// Authenticated workspace hub with role-tailored dashboards
export default function Home({ user: propUser }) {
  const auth = useAuth();
  const user = propUser !== undefined ? propUser : auth.user;
  const { isRecruiter, isAdmin } = auth;
  const { savedJobs, loadSavedJobs } = useSavedJobs();

  // Candidate state
  const [jobs, setJobs] = useState(null);
  const [jobViewTab, setJobViewTab] = useState('all');
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    user?.profile?.availability || 'Actively looking for a job'
  );
  const [candidateProfile, setCandidateProfile] = useState(user?.profile || null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Recruiter state
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loadingRecruiterJobs, setLoadingRecruiterJobs] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isRecruiter) {
      // Recruiter: Load their posted jobs & recent talent pool
      setLoadingRecruiterJobs(true);
      api('/api/jobs/recruiter/mine')
        .then((data) => setRecruiterJobs(Array.isArray(data) ? data : []))
        .catch(() => setRecruiterJobs([]))
        .finally(() => setLoadingRecruiterJobs(false));

      api('/api/search/candidates?q=')
        .then((res) => {
          const list = Array.isArray(res) ? res : res.candidates || [];
          setCandidates(list.slice(0, 4));
        })
        .catch(() => setCandidates([]));
    } else {
      // Job Seeker / Candidate: Load recommended roles & candidate profile
      api('/api/jobs?limit=10')
        .then((res) => {
          const list = Array.isArray(res) ? res : res.jobs || [];
          setJobs(list.slice(0, 10));
        })
        .catch(() => setJobs([]));

      api('/api/profile')
        .then((prof) => {
          setCandidateProfile(prof);
          if (prof?.availability) setCurrentStatus(prof.availability);
        })
        .catch(() => {});
    }
  }, [isRecruiter, isAdmin]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (isRecruiter) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (updatingStatus || newStatus === currentStatus) return;
    setUpdatingStatus(true);
    setCurrentStatus(newStatus);

    try {
      await api('/api/profile', {
        method: 'PUT',
        body: { availability: newStatus },
      });
      auth.updateUser({
        profile: { ...user?.profile, availability: newStatus },
      });
      toast.success('Availability status updated!');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (!isRecruiter && jobViewTab === 'saved') {
      loadSavedJobs();
    }
  }, [isRecruiter, jobViewTab, loadSavedJobs]);

  const displayedJobs = useMemo(() => {
    return jobViewTab === 'saved' ? savedJobs || [] : jobs || [];
  }, [jobViewTab, savedJobs, jobs]);

  return (
    <div className="max-w-[1120px] mx-auto">
      {isRecruiter ? (
        /* Recruiter Workspace: Active Roles, Candidate Sourcing, Stats */
        <RecruiterDashboard
          myJobs={recruiterJobs}
          loadingJobs={loadingRecruiterJobs}
          candidates={candidates}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
      ) : (
        /* Candidate Workspace: Profile Hero, Quick Actions, Recommended Jobs to Apply */
        <>
          <CandidateDashboardHero
            user={user}
            currentStatus={currentStatus}
            onUpdateStatus={handleUpdateStatus}
            updatingStatus={updatingStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onOpenCvModal={() => setIsCvModalOpen(true)}
          />

          {candidateProfile && (
            <div className="mb-6">
              <CompletenessMeter completeness={candidateProfile?.completeness} />
            </div>
          )}

          <CandidateQuickActions />

          <JobsFeedSection
            jobViewTab={jobViewTab}
            setJobViewTab={setJobViewTab}
            displayedJobs={displayedJobs}
          />
        </>
      )}

      <CvDropModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        onParsed={() => navigate('/onboarding')}
      />
    </div>
  );
}
