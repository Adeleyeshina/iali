import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, ShieldCheck, Award, Users, ArrowRight, AlertCircle, Globe } from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';
import VerificationModal from '../../components/VerificationModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

// Recruiter jobs overview screen
export default function MyJobs() {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState(null);
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
      await api(`/api/jobs/${jobId}/to-remote`, { method: 'PATCH' });
      toast.success('Job switched to remote successfully! Now visible nationwide.');
      loadJobs();
    } catch (err) {
      toast.error(err.message || 'Failed to switch job to remote');
    } finally {
      setSwitchingId(null);
    }
  };

  return (
    <div>
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
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs md:text-sm font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
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
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs md:text-sm font-semibold transition inline-flex items-center gap-1.5"
            >
              <span>Post a Role Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      )}

      {!loading && jobs?.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-base font-bold text-zinc-900 m-0">{job.title}</h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {job.status}
                    </span>
                    {job.outsideFlag && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Outside launch area</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 m-0 capitalize">
                    {job.workMode} · {job.city || 'Remote'} · Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <div className="text-left">
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold leading-none">Applicants</span>
                      <b className="text-sm text-zinc-900 leading-tight">{job._count?.applications || 0}</b>
                    </div>
                  </div>

                  <Link
                    to={`/recruiter/jobs/${job.id}/applicants`}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Review Applicants</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {job.outsideFlag && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      We are currently focused on Lagos and Ibadan. Your job is visible, but there may be fewer matching candidates in {job.city || 'this city'}. Switch to remote to reach people nationwide.
                    </span>
                  </div>
                  <button
                    disabled={switchingId === job.id}
                    onClick={() => handleSwitchToRemote(job.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white font-semibold transition cursor-pointer text-xs shrink-0 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{switchingId === job.id ? 'Switching…' : 'Switch to Remote'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recruiter verification request modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />
    </div>
  );
}
