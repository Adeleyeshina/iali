import { FileText, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

// Overview statistics for candidate submitted applications
export default function ApplicationsStats({ applications }) {
  if (!Array.isArray(applications)) return null;

  const total = applications.length;
  const inReview = applications.filter((a) => ['Submitted', 'Viewed'].includes(a.status) && !a.rejected).length;
  const interviewing = applications.filter((a) => ['Shortlisted', 'Interview'].includes(a.status) && !a.rejected).length;
  const offers = applications.filter((a) => ['Offer', 'Hired'].includes(a.status) && !a.rejected).length;

  const stats = [
    { label: 'Total Submitted', value: total, icon: FileText, color: 'text-indigo-950', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'In Review', value: inReview, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50/70 border-indigo-100' },
    { label: 'Interview Stage', value: interviewing, icon: Sparkles, color: 'text-coral-600', bg: 'bg-coral-50 border-coral-200' },
    { label: 'Offers / Hired', value: offers, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-4.5 shadow-xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} border flex items-center justify-center ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
          </div>
        );
      })}
    </div>
  );
}
