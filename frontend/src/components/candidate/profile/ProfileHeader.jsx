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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-base shadow-xs border border-indigo-800/40">
          {profile.name ? profile.name.slice(0, 2).toUpperCase() : <User className="w-6 h-6" />}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 m-0">My Profile</h1>
          <p className="text-xs text-slate-500 m-0">Candidate settings and talent pool profile</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-800 border border-slate-200 transition cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Summary</span>
        </button>
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-800 border border-slate-200 transition"
        >
          <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
          <span>Re-import from CV</span>
        </Link>
      </div>
    </div>
  );
}
