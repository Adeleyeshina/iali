import { Building2, ShieldCheck } from 'lucide-react';

// Specific input fields for recruiter signup
export default function RecruiterFields({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Company / Business Name *
        </label>
        <div className="relative">
          <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. Flutterwave, Paystack, Moniepoint"
            value={formData.companyName || ''}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-2xs"
          />
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-start gap-2.5 text-xs text-indigo-950">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <span className="leading-snug">
          Corporate emails (e.g. @company.com) receive automatic instant verification for publishing jobs and candidate messaging.
        </span>
      </div>
    </>
  );
}
