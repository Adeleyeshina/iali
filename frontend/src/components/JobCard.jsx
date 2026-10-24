import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, AlertCircle, Briefcase } from 'lucide-react';

export function initials(name) {
  return String(name || '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

// Job listing card component
export default function JobCard({ job, onToggleBookmark }) {
  const [isSaved, setIsSaved] = useState(false);
  const co = job.company || {};

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('iali_saved_jobs') || '[]');
      setIsSaved(savedList.includes(job.id));
    } catch {
      // ignore
    }
  }, [job.id]);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const savedList = JSON.parse(localStorage.getItem('iali_saved_jobs') || '[]');
      let next;
      if (savedList.includes(job.id)) {
        next = savedList.filter((id) => id !== job.id);
        setIsSaved(false);
      } else {
        next = [...savedList, job.id];
        setIsSaved(true);
      }
      localStorage.setItem('iali_saved_jobs', JSON.stringify(next));
      if (onToggleBookmark) onToggleBookmark(job.id, !isSaved);
    } catch {
      // ignore
    }
  };

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="flex items-start gap-3.5 p-4 md:p-5 bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl my-3 shadow-xs transition no-underline text-zinc-950 group relative"
    >
      <span className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shrink-0">
        {initials(co.name)}
      </span>
      <div className="flex-1 min-w-0 pr-8">
        <h3 className="text-base font-bold text-zinc-900 m-0 mb-1 group-hover:text-black">
          {job.title}
        </h3>
        <span className="text-xs md:text-sm text-zinc-500 flex items-center gap-1.5 flex-wrap mb-2">
          <span className="capitalize">{job.workMode}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>{job.city || 'Remote · Nigeria'}</span>
          </span>
          <span>·</span>
          <span>{co.name}</span>
        </span>
        <span className="flex items-center gap-1.5 flex-wrap">
          {co.verificationLevel === 'L2' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Employer
            </span>
          )}
          {job.outsideFlag && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Outside launch area</span>
            </span>
          )}
          {job.clientName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
              <Briefcase className="w-3 h-3 text-zinc-500" />
              <span>for {job.clientName}</span>
            </span>
          )}
        </span>
      </div>

      {/* Bookmark button */}
      <button
        type="button"
        onClick={toggleSave}
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
          isSaved
            ? 'bg-zinc-900 text-amber-400'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700'
        }`}
        title={isSaved ? 'Remove bookmark' : 'Save job'}
        aria-label="Save job"
      >
        <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
      </button>
    </Link>
  );
}
