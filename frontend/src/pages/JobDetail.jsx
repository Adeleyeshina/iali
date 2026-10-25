import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReportModal from '../components/ReportModal.jsx';
import JobDetailHeader from '../components/jobs/JobDetailHeader.jsx';
import JobDetailContent from '../components/jobs/JobDetailContent.jsx';
import JobDetailSidebar from '../components/jobs/JobDetailSidebar.jsx';
import { toast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

// Single job post details and candidate application screen
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
      <div className="max-w-[1120px] mx-auto bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs text-sm text-zinc-700">
        {errorMessage}{' '}
        <Link to="/jobs" className="inline-flex items-center gap-1 font-semibold text-zinc-950 underline ml-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to jobs</span>
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-[1120px] mx-auto">
        <div className="h-48 bg-zinc-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-4">
      <JobDetailHeader
        job={job}
        onOpenReport={() => setIsReportOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <JobDetailContent job={job} />

        <JobDetailSidebar
          job={job}
          hasApplied={hasApplied}
          applicationStatus={applicationStatus}
          applying={applying}
          onApply={handleApplyJob}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        jobId={job.id}
      />
    </div>
  );
}
