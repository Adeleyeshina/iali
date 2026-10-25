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

      {!loading && jobs?.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md rounded-2xl p-5 shadow-xs flex flex-col gap-3 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 m-0">{job.title}</h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 m-0 capitalize">
                    {job.workMode} · {job.city || 'Remote'} · Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">Applicants</span>
                      <b className="text-sm text-slate-900 leading-tight">{job._count?.applications || 0}</b>
                    </div>
                  </div>

                  <Link
                    to={`/recruiter/jobs/${job.id}/applicants`}
                    className="px-4 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                  >
                    <span>Review Applicants</span>
                    <ArrowRight className="w-3.5 h-3.5 text-coral-300" />
                  </Link>
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

      {/* Recruiter verification request modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />
    </div>
  );
}
