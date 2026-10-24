import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  PlusCircle,
  Users,
  MessageSquare,
  FileText,
  Target,
  Building2,
  Star,
  Sparkles,
  ClipboardList,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import JobCard from '../components/JobCard.jsx';
import CvDropModal from '../components/CvDropModal.jsx';
import WaitlistBanner from '../components/WaitlistBanner.jsx';
import { toast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

const CANDIDATE_STATUSES = [
  { value: 'Actively looking for a job', label: 'Actively looking for a job', dotBg: 'bg-emerald-500' },
  { value: 'Employed, but open to opportunities', label: 'Employed, open to offers', dotBg: 'bg-amber-500' },
  { value: 'Employed, not looking', label: 'Employed, not looking', dotBg: 'bg-blue-500' },
  { value: 'Just exploring / curious', label: 'Just exploring / curious', dotBg: 'bg-purple-500' },
];

// Main user dashboard and hub
export default function Home({ user }) {
  const [jobs, setJobs] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [jobViewTab, setJobViewTab] = useState('all'); // 'all' | 'saved'
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    user?.profile?.availability || 'Actively looking for a job'
  );
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  const isRecruiter = user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Load fresh jobs
    api('/api/jobs?limit=10')
      .then((res) => {
        const list = Array.isArray(res) ? res : res.jobs || [];
        setJobs(list.slice(0, 10));
      })
      .catch(() => setJobs([]));

    // Load saved job IDs from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('iali_saved_jobs') || '[]');
      setSavedJobIds(saved);
    } catch {
      // ignore
    }

    // If recruiter, also fetch preview of talent
    if (isRecruiter || isAdmin) {
      api('/api/search/candidates?q=')
        .then((res) => {
          const list = Array.isArray(res) ? res : res.candidates || [];
          setCandidates(list.slice(0, 4));
        })
        .catch(() => setCandidates([]));
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
      toast.success('Availability status updated!');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleBookmark = (jobId, isNowSaved) => {
    setSavedJobIds((prev) => (isNowSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)));
    if (!isNowSaved) {
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
    toast.success(isNowSaved ? 'Job saved to bookmarks' : 'Removed from saved jobs');
  };

  useEffect(() => {
    if (jobViewTab === 'saved') {
      if (savedJobIds.length === 0) {
        setSavedJobs([]);
        return;
      }
      setLoadingSaved(true);
      api(`/api/jobs?limit=50&ids=${savedJobIds.join(',')}`)
        .then((res) => {
          const list = Array.isArray(res) ? res : res.jobs || [];
          setSavedJobs(list);
        })
        .catch(() => setSavedJobs([]))
        .finally(() => setLoadingSaved(false));
    }
  }, [jobViewTab, savedJobIds.length]);

  const displayedJobs = jobViewTab === 'saved' ? savedJobs : jobs || [];

  const currentStatusObj =
    CANDIDATE_STATUSES.find((s) => s.value === currentStatus) || CANDIDATE_STATUSES[0];

  return (
    <>
      {/* 1. Recruiter Hub View */}
      {isRecruiter ? (
        <>
          <section className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Employer Workspace</span>
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 mb-2">
                  Welcome back, {user?.name || user?.email?.split('@')[0]}
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed">
                  Publish live job openings, source verified talent across Lagos, Ibadan & remote, and connect without recruiter fees.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs md:text-sm font-semibold transition shadow-xs flex items-center gap-1.5"
                  to="/post-job"
                >
                  <PlusCircle className="w-4 h-4 text-zinc-900" />
                  <span>Post a Job Free</span>
                </Link>
                <Link
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs md:text-sm font-semibold transition border border-white/15 flex items-center gap-1.5"
                  to="/recruiter/jobs"
                >
                  <Users className="w-4 h-4 text-white" />
                  <span>View Applicants</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Recruiter Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-4 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/recruiter/jobs')}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-zinc-700" />
                    <b className="text-sm font-bold text-zinc-900">My Posted Jobs</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Review incoming applicants and advance candidate stages.
                </p>
              </div>
              <Link className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline" to="/recruiter/jobs">
                <span>Review Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-4 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/post-job')}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-zinc-700" />
                    <b className="text-sm font-bold text-zinc-900">Publish Role</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800">
                    Free
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Create onsite or remote listings with instant review.
                </p>
              </div>
              <Link className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline" to="/post-job">
                <span>Open Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-4 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/search')}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-zinc-700" />
                    <b className="text-sm font-bold text-zinc-900">Talent Pool</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Filter by skills, city, and active search availability.
                </p>
              </div>
              <Link className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline" to="/search">
                <span>Browse Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-4 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/inbox')}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-zinc-700" />
                    <b className="text-sm font-bold text-zinc-900">Messages</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800">
                    Direct
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Direct candidate chat and interview invitations.
                </p>
              </div>
              <Link className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline" to="/inbox">
                <span>Open Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Candidate Pool Spotlight */}
          <div className="flex items-baseline justify-between mb-3 mt-6">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900">
              Available Candidates Spotlights
            </h2>
            <Link to="/search" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline">
              <span>Search all talent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {(candidates || []).map((cand) => (
              <div
                className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                key={cand.userId}
              >
                <div>
                  <b className="text-sm font-bold text-zinc-900 block">{cand.headline || 'Software Professional'}</b>
                  <p className="text-xs text-zinc-500 mt-1 mb-3 flex items-center gap-1">
                    <span>{(cand.skills || []).slice(0, 4).join(' · ')}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      <span>{cand.city || 'Lagos'}</span>
                    </span>
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {cand.availability || 'Actively looking'}
                  </span>
                  <Link
                    className="px-3 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition flex items-center gap-1"
                    to="/search"
                  >
                    <span>View & Message</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Live Platform Jobs */}
          <div className="flex items-baseline justify-between mb-3 mt-6">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900">
              Live Marketplace Jobs
            </h2>
            <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline">
              <span>View all jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!jobs && (
            <div className="space-y-3">
              <div className="bg-zinc-100 h-16 rounded-2xl animate-pulse" />
              <div className="bg-zinc-100 h-16 rounded-2xl animate-pulse" />
            </div>
          )}

          {(jobs || []).map((job) => (
            <JobCard key={job.id} job={job} onToggleBookmark={handleToggleBookmark} />
          ))}
        </>
      ) : (
        /* 2. Job Seeker (Candidate) Hub View */
        <>
          <section className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Job Seeker Dashboard</span>
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 mb-2">
                  Hello, {user?.name || user?.email?.split('@')[0]}
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed mb-4">
                  Verified companies in Lagos, Ibadan and remote are hiring on Iali. Discover roles, track applications, and keep your profile fresh.
                </p>

                {/* Candidate Status Selector */}
                <div className="inline-flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${currentStatusObj.dotBg} shrink-0`} />
                  <span className="text-xs font-semibold">Status:</span>
                  <select
                    className="bg-transparent text-white text-xs border border-white/20 rounded-lg px-2 py-1 outline-none cursor-pointer"
                    value={currentStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updatingStatus}
                  >
                    {CANDIDATE_STATUSES.map((st) => (
                      <option key={st.value} value={st.value} className="text-zinc-900">
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs md:text-sm font-semibold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  onClick={() => setIsCvModalOpen(true)}
                >
                  <FileText className="w-4 h-4 text-zinc-900" />
                  <span>Drop / Update CV</span>
                </button>
                <Link
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs md:text-sm font-semibold transition border border-white/15 flex items-center gap-1.5"
                  to="/applications"
                >
                  <ClipboardList className="w-4 h-4 text-white" />
                  <span>My Applications</span>
                </Link>
                <Link
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs md:text-sm font-semibold transition border border-white/15 flex items-center gap-1.5"
                  to="/inbox"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Messages</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Non-launch city waitlist banner */}
          <WaitlistBanner />

          {/* Job Search Form */}
          <form
            className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-zinc-200 shadow-xs mb-6"
            onSubmit={handleSearch}
          >
            <input
              placeholder="Search by job title, skill (React, Python) or city (Lagos, Remote)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search jobs"
              className="flex-1 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 bg-transparent border-0 focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              type="submit"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Recommended Roles Header with All / Saved Tabs */}
          <div className="flex items-baseline justify-between mb-3 mt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setJobViewTab('all')}
                className={`text-sm md:text-base font-bold transition cursor-pointer ${
                  jobViewTab === 'all'
                    ? 'text-zinc-900 border-b-2 border-zinc-900 pb-0.5'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Recommended Roles
              </button>
              <button
                onClick={() => setJobViewTab('saved')}
                className={`text-sm md:text-base font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  jobViewTab === 'saved'
                    ? 'text-zinc-900 border-b-2 border-zinc-900 pb-0.5'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Saved Jobs</span>
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-800 font-semibold">
                  {savedJobIds.length}
                </span>
              </button>
            </div>

            <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline">
              <span>See all roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!jobs && (
            <div className="space-y-3">
              <div className="bg-zinc-100 h-16 rounded-2xl animate-pulse" />
              <div className="bg-zinc-100 h-16 rounded-2xl animate-pulse" />
            </div>
          )}

          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} onToggleBookmark={handleToggleBookmark} />
          ))}

          {displayedJobs.length === 0 && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center text-sm text-zinc-500 my-4">
              {jobViewTab === 'saved'
                ? 'No saved jobs yet — click the star icon on any role to bookmark it.'
                : 'No live roles yet — check back soon!'}
            </div>
          )}

          {/* Candidate Feature Cards */}
          <div className="mt-8 mb-3">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900">
              Fast-track your job search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => setIsCvModalOpen(true)}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-zinc-900" />
                    <b className="text-sm font-bold text-zinc-900">Instant CV Auto-Fill</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800">
                    Fast
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-4">
                  Drop your PDF or paste your resume. We extract your skills, title, and years of experience.
                </p>
              </div>
              <button
                type="button"
                className="self-start px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCvModalOpen(true);
                }}
              >
                <span>Upload / Drop CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/applications')}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-zinc-900" />
                    <b className="text-sm font-bold text-zinc-900">Application Tracker</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    Direct
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-4">
                  Track submitted applications in real time from Submitted to Review, Interview, and Offer.
                </p>
              </div>
              <Link
                className="self-start px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold transition flex items-center gap-1"
                to="/applications"
              >
                <span>View Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div
              className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/inbox')}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-zinc-900" />
                    <b className="text-sm font-bold text-zinc-900">Messages & Offers</b>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800">
                    Direct
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-4">
                  Chat with verified employers and respond to incoming interview invitations.
                </p>
              </div>
              <Link
                className="self-start px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold transition flex items-center gap-1"
                to="/inbox"
              >
                <span>Open Messages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* CV Modal */}
      <CvDropModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        user={user}
      />
    </>
  );
}
