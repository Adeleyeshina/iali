import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building2,
  Award,
  AlertTriangle,
  MapPin,
  Check,
  X,
} from 'lucide-react';
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
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs text-sm text-zinc-700 flex items-center gap-2">
        <Lock className="w-4 h-4 text-zinc-500" />
        <span>{errorMessage}</span>
      </div>
    );
  }

  if (!queuesData) {
    return (
      <div className="space-y-3">
        <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
        <div className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const pendingJobs = queuesData.jobs || [];
  const pendingVerifications = queuesData.verifications || [];
  const waitlistMap = queuesData.waitlist || {};

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Trust Centre</h1>
        <ShieldCheck className="w-6 h-6 text-emerald-600" />
      </div>
      <p className="text-xs md:text-sm text-zinc-500 mb-6">
        Verify employer CAC & CIPM credentials, review first jobs & safety reports, and monitor nationwide demand.
      </p>

      {/* Jobs Pending Review */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-zinc-900">
            Jobs pending review ({pendingJobs.length})
          </h3>
        </div>

        {pendingJobs.length === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Job review queue clear</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 pr-4">Role & Company</th>
                  <th className="py-2.5 px-4">Location & Mode</th>
                  <th className="py-2.5 pl-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {pendingJobs.map((jobItem) => (
                  <tr key={jobItem.id}>
                    <td className="py-3 pr-4">
                      <b className="text-zinc-900 text-xs md:text-sm block">{jobItem.title}</b>
                      <span className="text-[11px] text-zinc-500">{jobItem.company?.name || 'Company'}</span>
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {jobItem.workMode} · {jobItem.city || 'Remote'}
                      {jobItem.outsideFlag && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                          Outside launch area
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right space-x-2">
                      <button
                        className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        onClick={() => handleReviewDecision('job', jobItem.id, true)}
                        disabled={decidingId === jobItem.id}
                      >
                        {decidingId === jobItem.id ? 'Updating…' : 'Approve'}
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer disabled:opacity-50"
                        onClick={() => handleReviewDecision('job', jobItem.id, false)}
                        disabled={decidingId === jobItem.id}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification & Safety Reports */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-zinc-900">
            Verification & Reports Queue ({pendingVerifications.length})
          </h3>
        </div>

        {pendingVerifications.length === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All verification & safety queues resolved</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingVerifications.map((item) => {
              const isReport = item.type?.startsWith('REPORT');
              const isCipm = item.type?.startsWith('CIPM');

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isReport ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Report</span>
                        </span>
                      ) : isCipm ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <Award className="w-3 h-3 text-blue-600" />
                          <span>CIPM Professional</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Building2 className="w-3 h-3 text-emerald-600" />
                          <span>CAC Verification</span>
                        </span>
                      )}
                      <b className="text-zinc-900">{item.user?.name || item.user?.email || item.userId}</b>
                    </div>
                    <p className="text-zinc-700 font-mono text-[11px] m-0 break-words">{item.type}</p>
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Submitted: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      onClick={() => handleReviewDecision('verification', item.id, true)}
                      disabled={decidingId === item.id}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{decidingId === item.id ? 'Updating…' : isReport ? 'Resolve' : 'Approve'}</span>
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-900 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      onClick={() => handleReviewDecision('verification', item.id, false)}
                      disabled={decidingId === item.id}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Demand Signals */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-5">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-zinc-700" />
          <h3 className="text-base font-bold text-zinc-900">Demand Signals by City</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Waitlist sign-ups & candidate profiles across non-launch regions to determine the next expansion city.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(waitlistMap).map(([cityName, count]) => (
            <div key={cityName} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-xs font-semibold text-zinc-900 block truncate">{cityName}</span>
              <span className="text-xs text-zinc-500">{count} interested candidates</span>
            </div>
          ))}
          {Object.keys(waitlistMap).length === 0 && (
            <p className="text-xs text-zinc-400 col-span-full">No waitlist signals registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
