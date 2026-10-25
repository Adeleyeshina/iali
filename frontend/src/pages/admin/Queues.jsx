import { useEffect, useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import PendingJobsQueue from '../../components/admin/PendingJobsQueue.jsx';
import PendingVerificationsQueue from '../../components/admin/PendingVerificationsQueue.jsx';
import WaitlistDemandQueue from '../../components/admin/WaitlistDemandQueue.jsx';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';

// Admin trust centre and moderation queue screen
export default function Queues() {
  const [queuesData, setQueuesData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [decidingId, setDecidingId] = useState(null);
  const toast = useToast();

  const fetchQueues = () =>
    api('/api/admin/queues')
      .then((data) => {
        setQueuesData(data);
        setErrorMessage('');
      })
      .catch((err) => {
        setErrorMessage(err.message + ' — log in as admin@iali.ng');
      });

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleReviewDecision = async (kind, targetId, isApproved) => {
    try {
      setDecidingId(targetId);
      await api('/api/admin/decide', {
        method: 'POST',
        body: {
          kind,
          targetId,
          ok: isApproved,
          reason: isApproved ? 'Approved by admin' : 'Rejected by admin',
        },
      });
      toast.success(`Decision applied: ${isApproved ? 'Approved' : 'Dismissed'}`);
      await fetchQueues();
    } catch (err) {
      toast.error(err.message || 'Failed to apply decision');
    } finally {
      setDecidingId(null);
    }
  };

  if (errorMessage && !queuesData) {
    return (
      <div className="max-w-[1120px] mx-auto bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs text-sm text-zinc-700 flex items-center gap-2">
        <Lock className="w-4 h-4 text-zinc-500" />
        <span>{errorMessage}</span>
      </div>
    );
  }

  if (!queuesData) {
    return (
      <div className="max-w-[1120px] mx-auto space-y-3">
        <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const pendingJobs = queuesData.jobs || [];
  const pendingVerifications = queuesData.verifications || [];
  const waitlistMap = queuesData.waitlist || {};

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Trust Centre</h1>
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <p className="text-xs md:text-sm text-zinc-500">
          Verify employer CAC & CIPM credentials, moderate first jobs, and monitor nationwide demand.
        </p>
      </div>

      <PendingJobsQueue
        pendingJobs={pendingJobs}
        onDecision={handleReviewDecision}
        decidingId={decidingId}
      />

      <PendingVerificationsQueue
        pendingVerifications={pendingVerifications}
        onDecision={handleReviewDecision}
        decidingId={decidingId}
      />

      <WaitlistDemandQueue waitlistMap={waitlistMap} />
    </div>
  );
}
