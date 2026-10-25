import { Check, X, CheckCircle2, Building2 } from 'lucide-react';

// Verification requests queue for employer credentials
export default function PendingVerificationsQueue({
  pendingVerifications,
  onDecision,
  decidingId,
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs mb-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-zinc-900">
          Verification requests ({pendingVerifications.length})
        </h3>
      </div>

      {pendingVerifications.length === 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium py-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>No pending company verification requests</span>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingVerifications.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-500" />
                  <b className="text-sm font-bold text-zinc-900">{item.companyName}</b>
                </div>
                <div className="text-xs text-zinc-500 mt-1 space-x-3">
                  <span>CAC RC: {item.cacNumber || 'N/A'}</span>
                  <span>CIPM Member: {item.cipmNumber || 'N/A'}</span>
                  <span>Requester: {item.userEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onDecision('verification', item.id, true)}
                  disabled={decidingId === item.id}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDecision('verification', item.id, false)}
                  disabled={decidingId === item.id}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
