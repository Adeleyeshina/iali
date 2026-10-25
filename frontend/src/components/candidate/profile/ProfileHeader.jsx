import { Link } from 'react-router-dom';
import { User, Copy, UploadCloud } from 'lucide-react';
import { copyToClipboard } from '../../../lib/clipboard.js';

// Candidate profile top header and quick actions
export default function ProfileHeader({ profile }) {
  const handleCopySummary = () => {
    const text = `${profile.name || 'Candidate'} · ${profile.headline || 'Job Seeker'}\nSkills: ${(profile.skills || []).join(', ')}\nLocation: ${profile.city || 'Nigeria'}`;
    copyToClipboard(text, 'Profile summary copied!');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-base shadow-xs border border-indigo-800/40 shrink-0">
          {profile.name ? profile.name.slice(0, 2).toUpperCase() : <User className="w-5 h-5 sm:w-6 sm:h-6" />}
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 m-0 truncate">My Profile</h1>
          <p className="text-xs text-slate-500 m-0 truncate">Candidate settings and talent pool profile</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-800 border border-slate-200 transition cursor-pointer text-center"
        >
          <Copy className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Copy Summary</span>
        </button>
        <Link
          to="/onboarding"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-800 border border-slate-200 transition text-center"
        >
          <UploadCloud className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">Re-import from CV</span>
        </Link>
      </div>
    </div>
  );
}
