import { X, Clock, CheckCircle2, Building2, MapPin } from 'lucide-react';

export default function ApplicationTimelineModal({ isOpen, onClose, application }) {
  if (!isOpen || !application) return null;

  const job = application.job || {};
  const company = job.company || {};
  const history = application.history || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Offer':
      case 'Hired':
        return 'bg-emerald-600 text-white';
      case 'Interview':
      case 'Shortlisted':
        return 'bg-amber-500 text-white';
      case 'Viewed':
        return 'bg-blue-600 text-white';
      case 'Rejected':
        return 'bg-rose-500 text-white';
      case 'Withdrawn':
        return 'bg-zinc-400 text-white';
      case 'Submitted':
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/90 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Application Timeline
            </span>
            <h3 className="text-lg font-black text-slate-900 m-0">
              {job.title || 'Job Application'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              {company.name && (
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.name}</span>
                </span>
              )}
              {job.city && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.city}</span>
                  </span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t border-slate-100 pt-4 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No status changes recorded yet.
            </p>
          ) : (
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.map((item, index) => {
                const date = new Date(item.changedAt);
                const isLatest = index === history.length - 1;

                return (
                  <div key={item.id || index} className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {isLatest ? '●' : '✓'}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <b className="text-sm font-bold text-slate-900">{item.status}</b>
                        <span className="text-[11px] text-slate-400">
                          {date.toLocaleDateString()} at{' '}
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5 m-0">
                        Updated by:{' '}
                        <span className="font-semibold text-slate-700 capitalize">
                          {item.changedByRole === 'candidate' ? 'You' : item.changedByRole || 'Employer'}
                        </span>
                        {item.note && ` — ${item.note}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
