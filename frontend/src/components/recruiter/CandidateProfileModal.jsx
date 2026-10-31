import { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquare,
  Globe,
  Loader2,
  User,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../lib/api.js';

export default function CandidateProfileModal({
  isOpen,
  onClose,
  candidate: initialCandidate,
  onOpenMessage,
}) {
  const [candidate, setCandidate] = useState(initialCandidate);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialCandidate) {
      setCandidate(null);
      return;
    }

    setCandidate(initialCandidate);

    const targetId = initialCandidate.userId || initialCandidate.id;
    if (targetId) {
      setLoading(true);
      api(`/api/candidates/${targetId}`)
        .then((fullData) => {
          if (fullData) {
            setCandidate((prev) => ({ ...prev, ...fullData }));
          }
        })
        .catch(() => {
          // Fall back gracefully to the provided data
        })
        .finally(() => setLoading(false));
    }
  }, [initialCandidate, isOpen]);

  if (!isOpen || !candidate) return null;

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('actively')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Actively looking
        </span>
      );
    }
    if (lower.includes('open')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          Open to offers
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
        Exploring
      </span>
    );
  };

  const experienceList = Array.isArray(candidate.experience) ? candidate.experience : [];
  const educationList = Array.isArray(candidate.education) ? candidate.education : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Up right side corner close button */}
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer z-20"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 pr-10 sm:pr-14 pt-1">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {candidate.photoUrl ? (
              <img
                src={candidate.photoUrl}
                alt={candidate.name || 'Candidate'}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-extrabold text-lg shadow-xs border border-indigo-800/40 shrink-0">
                {candidate.name ? candidate.name.slice(0, 2).toUpperCase() : <User className="w-7 h-7" />}
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 m-0">
                  {candidate.name || 'Anonymous Candidate'}
                </h2>
                {getStatusBadge(candidate.availability)}
                {candidate.completeness?.score >= 80 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {candidate.completeness?.score >= 100 ? '100% Vetted' : `${candidate.completeness?.score}% Complete`}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-slate-600 m-0">
                {candidate.headline || 'Software Engineer'}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.city || 'Nigeria'}
                </span>
                {candidate.workModePref && (
                  <span className="capitalize text-slate-600 font-medium">
                    · Prefers {candidate.workModePref}
                  </span>
                )}
                {candidate.willingRelocate && (
                  <span className="text-indigo-600 font-medium">
                    · Willing to relocate
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          {onOpenMessage && (
            <div className="shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMessage(candidate);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5 text-coral-300" />
                <span>Direct Message</span>
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading full profile details…</span>
          </div>
        )}

        <div className="space-y-6 pt-5">
          {/* About / Summary Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Professional Summary
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              {candidate.summary ||
                `${candidate.name || 'This candidate'} is a verified tech professional based in ${candidate.city || 'Nigeria'}, actively looking for ${candidate.workModePref || 'remote'} opportunities.`}
            </p>
          </div>

          {/* Technical Skills Stack */}
          {Array.isArray(candidate.skills) && candidate.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tech Stack & Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-indigo-50/80 border border-indigo-200/70 text-indigo-950 text-xs font-semibold shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {experienceList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0">
                  Work Experience
                </h3>
              </div>
              <div className="space-y-3">
                {experienceList.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-200 transition space-y-1 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <b className="text-xs md:text-sm font-bold text-slate-900">
                        {exp.title || exp.role || 'Role'}
                      </b>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {exp.period || exp.duration || exp.dates || ''}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 block">
                      {exp.company || exp.employer || ''}
                    </span>
                    {exp.description && (
                      <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educationList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0">
                  Education & Background
                </h3>
              </div>
              <div className="space-y-2.5">
                {educationList.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white space-y-0.5 shadow-2xs"
                  >
                    <b className="text-xs font-bold text-slate-900 block">
                      {edu.degree || edu.qualification || 'Degree'}
                    </b>
                    <span className="text-xs text-slate-600 block">
                      {edu.school || edu.institution || ''}
                    </span>
                    {edu.year && (
                      <span className="text-[11px] text-slate-400 block">{edu.year}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached CV / Resume */}
          {(candidate.cvUrl || candidate.cvFileName) && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Attached Resume / CV
              </h3>
              <a
                href={candidate.cvUrl || '#'}
                target={candidate.cvUrl ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!candidate.cvUrl) {
                    e.preventDefault();
                    window.alert(`Candidate attached resume: ${candidate.cvFileName || 'Resume.pdf'}`);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition shadow-2xs"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>{candidate.cvFileName || 'Download Candidate Resume (PDF)'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
