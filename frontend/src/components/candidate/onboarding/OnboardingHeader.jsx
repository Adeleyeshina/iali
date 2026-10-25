import { FileText, CheckCircle2 } from 'lucide-react';

// Step progress indicator for candidate CV parsing onboarding
export default function OnboardingHeader({ currentStep }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            Profile Auto-Setup from CV
          </h1>
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-xs text-slate-500">
          Upload your resume to extract skills, experience, and headline in seconds.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            currentStep === 1
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {currentStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : '1'}
          <span>Upload Resume</span>
        </div>

        <div className="w-4 h-0.5 bg-slate-200"></div>

        <div
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            currentStep === 2
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          <span>2. Confirm Profile</span>
        </div>
      </div>
    </div>
  );
}
