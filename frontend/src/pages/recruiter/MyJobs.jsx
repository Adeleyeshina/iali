import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  ShieldCheck,
  Users,
  ArrowRight,
  Globe,
  Edit3,
  Trash2,
  Tag,
} from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';
import VerificationModal from '../../components/VerificationModal.jsx';
import EditJobModal from '../../components/recruiter/EditJobModal.jsx';
import DeleteJobModal from '../../components/recruiter/DeleteJobModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

// Recruiter jobs overview screen with clean Edit & Delete management
export default function MyJobs() {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();

  const loadJobs = () => {
    setLoading(true);
    api('/api/jobs/recruiter/mine')
      .then((data) => setJobs(data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSwitchToRemote = async (jobId) => {
    try {
      setSwitchingId(jobId);
      const updated = await api(`/api/jobs/${jobId}/to-remote`, { method: 'PATCH' });
      toast.success('Job switched to remote successfully! Now visible nationwide.');
      setJobs((prev) =>
        prev ? prev.map((j) => (j.id === jobId ? { ...j, ...updated, workMode: 'remote', city: null } : j)) : []
      );
    } catch (err) {
      toast.error(err.message || 'Failed to switch job to remote');
    } finally {
      setSwitchingId(null);
    }
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev ? prev.map((j) => (j.id === updatedJob.id ? { ...j, ...updatedJob } : j)) : []
    );
  };

  const handleJobDeleted = (deletedJobId) => {
    setJobs((prev) => (prev ? prev.filter((j) => j.id !== deletedJobId) : []));
  };

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    if (statusFilter === 'all') return jobs;
    return jobs.filter((j) => (j.status || 'Live').toLowerCase() === statusFilter.toLowerCase());
  }, [jobs, statusFilter]);

  const counts = useMemo(() => {
    if (!jobs) return { all: 0, live: 0, closed: 0 };
    return {
      all: jobs.length,
      live: jobs.filter((j) => (j.status || 'Live') === 'Live').length,
      closed: jobs.filter((j) => j.status === 'Closed').length,
      pending: jobs.filter((j) => j.status === 'Pending Review').length,
    };
  }, [jobs]);

  const getStatusBadge = (status = 'Live') => {
    switch (status) {
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Closed
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending Review
          </span>
        );
      case 'Live':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Live
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto my-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Posted Jobs</h1>
            <Briefcase className="w-5 h-5 text-zinc-700" />
          </div>
          <p className="text-xs md:text-sm text-zinc-500">
            Manage your listings and review applicants across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsVerificationOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Get Verified / CIPM</span>
          </button>
          <Link
            to="/post-job"
            className="px-4 py-2 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-xs md:text-sm font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      {!loading && jobs && jobs.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer border ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Jobs ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('Live')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer border ${
              statusFilter === 'Live'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            🟢 Live ({counts.live})
          </button>
          {counts.pending > 0 && (
            <button
              onClick={() => setStatusFilter('Pending Review')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer border ${
                statusFilter === 'Pending Review'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🟡 Pending ({counts.pending})
            </button>
          )}
          {counts.closed > 0 && (
            <button
              onClick={() => setStatusFilter('Closed')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer border ${
                statusFilter === 'Closed'
                  ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Closed ({counts.closed})
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      )}

      {!loading && jobs?.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          hint="Post your first open role for free to start receiving verified candidate applications."
          action={
            <Link
              to="/post-job"
              className="px-4 py-2 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-xs md:text-sm font-bold transition inline-flex items-center gap-1.5 shadow-md"
            >
              <span>Post a Role Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      )}

      {!loading && jobs?.length > 0 && filteredJobs.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center my-4 shadow-xs">
          <p className="text-sm font-semibold text-slate-700 mb-2">No {statusFilter} jobs found</p>
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Show all jobs
          </button>
        </div>
      )}

      {!loading && filteredJobs.length > 0 && (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md rounded-2xl p-5 shadow-xs flex flex-col gap-3 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 m-0">{job.title}</h2>
                    {getStatusBadge(job.status)}
                    {job.clientName && (
                      <span className="text-xs text-slate-400">· for {job.clientName}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 m-0 capitalize">
                    {job.workMode} · {job.city || 'Remote'} · Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>

                  {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {job.requiredSkills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="text-[11px] text-slate-400">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Applicants counter */}
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 whitespace-nowrap shrink-0">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-900">{job._count?.applications || 0}</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {(job._count?.applications || 0) === 1 ? 'Applicant' : 'Applicants'}
                    </span>
                  </div>

                  {/* Review Applicants Button */}
                  <Link
                    to={`/recruiter/jobs/${job.id}/applicants`}
                    className="px-3.5 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-indigo-500/20 shrink-0"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3.5 h-3.5 text-coral-300" />
                  </Link>

                  {/* Edit Job Button (Opens Edit Modal to update title, status, description, skills, etc.) */}
                  <button
                    type="button"
                    onClick={() => setEditingJob(job)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0"
                    title="Edit job details and status"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Job Button */}
                  <button
                    type="button"
                    onClick={() => setDeletingJob(job)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0"
                    title="Delete job posting"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {job.workMode !== 'remote' && (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100">
                  <span>Hiring locally in {job.city || 'Nigeria'}. Want to expand candidate reach nationwide?</span>
                  <button
                    disabled={switchingId === job.id}
                    onClick={() => handleSwitchToRemote(job.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition cursor-pointer text-xs flex items-center gap-1 shadow-2xs disabled:opacity-50 self-start sm:self-auto"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{switchingId === job.id ? 'Switching…' : 'Switch to Nationwide Remote'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Job Modal */}
      <EditJobModal
        isOpen={Boolean(editingJob)}
        onClose={() => setEditingJob(null)}
        job={editingJob}
        onJobUpdated={handleJobUpdated}
      />

      {/* Delete Job Modal */}
      <DeleteJobModal
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        job={deletingJob}
        onJobDeleted={handleJobDeleted}
      />

      {/* Recruiter verification request modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />
    </div>
  );
}
