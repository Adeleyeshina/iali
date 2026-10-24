import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2, MapPin, ExternalLink, ArrowRight, XCircle } from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

const STAGES = ['Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Hired'];

// Candidate application tracking screen
export default function Applications() {
  const [applications, setApplications] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [confirmWithdrawTarget, setConfirmWithdrawTarget] = useState(null);
  const toast = useToast();

  const loadApplications = () => {
    api('/api/applications/mine')
      .then((data) => setApplications(data))
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdrawConfirm = async () => {
    if (!confirmWithdrawTarget) return;
    try {
      setWithdrawingId(confirmWithdrawTarget.id);
      await api(`/api/applications/${confirmWithdrawTarget.id}/withdraw`, { method: 'PATCH' });
      toast.success('Application withdrawn successfully');
      setConfirmWithdrawTarget(null);
      loadApplications();
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  if (!applications) {
    return (
      <div className="space-y-3">
        <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No applications yet"
        hint="One tap applies with your saved profile. Track every stage here."
        action={
          <Link
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs md:text-sm font-semibold transition inline-flex items-center gap-1.5"
            to="/jobs"
          >
            <span>Find roles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My applications</h1>
        <FileText className="w-5 h-5 text-zinc-700" />
      </div>
      <p className="text-xs md:text-sm text-zinc-500 mb-5">
        Live status tracking across all your submitted job applications.
      </p>

      {applications.map((application) => {
        const currentStageIndex = STAGES.indexOf(application.status);
        const job = application.job || {};
        const company = job.company || {};

        return (
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-3.5" key={application.id}>
            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
              <div>
                <b className="text-base font-bold text-zinc-900 block">
                  {job.title || `Role #${application.jobId.slice(0, 8)}`}
                </b>
                <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  {company.name && (
                    <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{company.name}</span>
                    </span>
                  )}
                  {job.city && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{job.city}</span>
                      </span>
                    </>
                  )}
                  <span>·</span>
                  <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    application.status === 'Withdrawn'
                      ? 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      : application.rejected
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      application.status === 'Withdrawn'
                        ? 'bg-zinc-400'
                        : application.rejected
                        ? 'bg-rose-500'
                        : 'bg-emerald-600'
                    }`}
                  ></span>
                  {application.rejected ? 'Rejected' : application.status}
                </span>

                <Link
                  to={`/jobs/${application.jobId}`}
                  className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 transition"
                  title="View job posting"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                {application.status !== 'Withdrawn' && !application.rejected && application.status !== 'Hired' && (
                  <button
                    onClick={() =>
                      setConfirmWithdrawTarget({
                        id: application.id,
                        title: job.title || 'Role',
                        company: company.name || 'Employer',
                      })
                    }
                    disabled={withdrawingId === application.id}
                    className="p-1 px-2 text-xs font-semibold rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-500 transition cursor-pointer flex items-center gap-1"
                    title="Withdraw this application"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stages progress bar */}
            {application.status !== 'Withdrawn' ? (
              <div className="flex gap-1.5 my-3">
                {STAGES.map((stageName, index) => {
                  const isPassed = currentStageIndex >= 0 && index <= currentStageIndex;
                  return (
                    <span
                      key={stageName}
                      title={stageName}
                      className={`h-2 flex-1 rounded-full transition ${
                        isPassed ? 'bg-zinc-950' : 'bg-zinc-200'
                      }`}
                    />
                  );
                })}
              </div>
            ) : null}

            <p className="text-xs text-zinc-500 m-0">
              {application.status === 'Withdrawn'
                ? 'Application withdrawn by you.'
                : application.status === 'Submitted'
                ? 'Sent — recruiter hasn’t opened it yet.'
                : `Stage: ${application.status}. You will receive in-app notifications on status changes.`}
            </p>
          </div>
        );
      })}

      {/* Confirmation Modal for Application Withdrawal */}
      <ConfirmModal
        isOpen={Boolean(confirmWithdrawTarget)}
        onClose={() => setConfirmWithdrawTarget(null)}
        onConfirm={handleWithdrawConfirm}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for "${confirmWithdrawTarget?.title}" at ${confirmWithdrawTarget?.company}? This action will notify the employer that you are no longer in the candidate pool.`}
        confirmText="Yes, Withdraw"
        cancelText="Keep Application"
        variant="danger"
        loading={Boolean(withdrawingId)}
      />
    </div>
  );
}
