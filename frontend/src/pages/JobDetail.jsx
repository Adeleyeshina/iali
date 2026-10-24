import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Flag,
  ShieldCheck,
  Shield,
  ShieldAlert,
  AlertCircle,
  Briefcase,
  MapPin,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { initials } from '../components/JobCard.jsx';
import ReportModal from '../components/ReportModal.jsx';
import { toast } from '../context/ToastContext.jsx';
import { copyToClipboard } from '../lib/clipboard.js';
import { api } from '../lib/api.js';

// Job detail screen
export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    api(`/api/jobs/${id}`)
      .then((data) => {
        setJob(data);
        if (data?.hasApplied) {
          setHasApplied(true);
          setApplicationStatus(data.userApplication?.status || 'Submitted');
        }
      })
      .catch((err) => setErrorMessage(err.message));
  }, [id]);

  const handleApplyJob = async () => {
    if (applying || hasApplied) return;
    setApplying(true);
    setErrorMessage('');

    try {
      const response = await api(`/api/jobs/${id}/apply`, {
        method: 'POST',
        body: {},
      });
      setHasApplied(true);
      setApplicationStatus('Submitted');
      const msg = 'Application submitted' + (response.notice ? ` — ${response.notice}` : '');
      setSuccessMessage(msg);
      toast.success('Application submitted successfully!');
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already applied')) {
        setHasApplied(true);
        setApplicationStatus('Submitted');
        toast.info('You have already applied to this job.');
        return;
      }
      let msg = err.message || 'Failed to submit application';
      if (msg.includes('401') || msg.toLowerCase().includes('log in first') || msg.toLowerCase().includes('unauthorized')) {
        msg = 'Please log in as a candidate to apply.';
      }
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (errorMessage && !job) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs text-sm text-zinc-700">
        {errorMessage}{' '}
        <Link to="/jobs" className="inline-flex items-center gap-1 font-semibold text-zinc-950 underline ml-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to jobs</span>
        </Link>
      </div>
    );
  }

  if (!job) {
    return <div className="h-48 bg-zinc-100 rounded-3xl animate-pulse" />;
  }

  const company = job.company || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All jobs</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(window.location.href, 'Job link copied to clipboard!')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Job Link</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold text-zinc-600 transition cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Job</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs mb-4">
        {/* Company Header */}
        <div className="flex items-center gap-4 mb-5">
          <span className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {initials(company.name)}
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 m-0 mb-1">
              {job.title}
            </h1>
            <div className="text-xs md:text-sm text-zinc-500 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>{company.name}</span>
              </span>
              <span>·</span>
              <span className="capitalize">{job.workMode}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{job.city || 'Remote · Nigeria'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tags and Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {company.verificationLevel === 'L2' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Company</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>Unverified company</span>
            </span>
          )}
          {job.outsideFlag && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Outside launch area</span>
            </span>
          )}
          {job.clientName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
              <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
              <span>Posted on behalf of {job.clientName}</span>
            </span>
          )}
        </div>

        <p className="text-sm md:text-base text-zinc-700 leading-relaxed mb-6 whitespace-pre-line">
          {job.description}
        </p>

        {hasApplied ? (
          <div className="pt-2">
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 text-sm font-semibold opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Already applied{applicationStatus ? ` · ${applicationStatus}` : ''}</span>
            </button>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <span>You applied for this role.</span>
              <Link to="/applications" className="font-bold underline text-zinc-950 inline-flex items-center gap-1">
                <span>Track application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <button
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
              onClick={handleApplyJob}
              disabled={applying}
            >
              <span>{applying ? 'Submitting application…' : 'Apply in one tap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="mt-3 text-xs text-rose-600 font-medium">{errorMessage}</p>
        )}
      </div>

      {/* Safety Notice */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-600 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-zinc-500 shrink-0" />
        <span>
          Never pay to apply. Iali immediately removes anyone who asks for money, training fees, or bank details.
        </span>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="job"
        targetId={job.id}
        targetTitle={`${job.title} at ${company.name}`}
      />
    </div>
  );
}
