import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Building2, MapPin } from 'lucide-react';

// Recruiter applicants view header with role summary
export default function JobApplicantsHeader({ job, applicantsCount }) {
  if (!job) return null;

  return (
    <div className="mb-4">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-black mb-3 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all posted jobs</span>
      </Link>

      <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800">
              {job.workMode || 'remote'}
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {job.city || 'Nigeria'}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mb-1">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>{job.company?.name || 'Your Company'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 shrink-0">
          <Users className="w-5 h-5 text-zinc-700" />
          <div>
            <div className="text-lg font-bold text-zinc-900">{applicantsCount}</div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Total Submissions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
