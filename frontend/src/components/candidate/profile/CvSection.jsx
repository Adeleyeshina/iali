import { Link } from 'react-router-dom';
import { FileText, UploadCloud } from 'lucide-react';

// CV attachment card and re-upload link
export default function CvSection({ profile, breakdown, sectionRef }) {
  return (
    <div className="space-y-3" ref={sectionRef}>
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-zinc-500" />
          <span>4. CV Attachment (20%)</span>
        </span>
        <span className="text-[11px] font-bold text-zinc-400">
          {breakdown?.cv ?? 0} / 20%
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <b className="text-xs font-bold text-slate-900 block">
            {profile.cvFileName ? profile.cvFileName : 'No CV currently attached'}
          </b>
          <p className="text-[11px] text-slate-500 mt-0.5 m-0">
            Upload your latest resume PDF or TXT to automatically parse and boost your profile score.
          </p>
        </div>

        <Link
          to="/onboarding"
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shrink-0 inline-flex items-center gap-1 shadow-xs"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>{profile.cvFileName ? 'Update CV' : 'Upload CV'}</span>
        </Link>
      </div>
    </div>
  );
}
