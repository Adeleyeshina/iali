import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Sparkles,
  Paperclip,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

export default function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Application form fields
  const [cvChoice, setCvChoice] = useState('profile'); // 'profile' | 'custom'
  const [customFile, setCustomFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api(`/api/jobs/${id}`),
      api('/api/profile').catch(() => null),
    ])
      .then(([jobData, profileData]) => {
        if (!isMounted) return;
        setJob(jobData);
        if (jobData?.hasApplied) {
          setHasApplied(true);
          setApplicationStatus(jobData?.userApplication?.status || 'Submitted');
        }
        if (profileData) {
          setProfile(profileData);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Failed to load job details');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume file must be under 5MB');
      return;
    }

    setCustomFile(file);
    setCvChoice('custom');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || hasApplied) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const activeCvName =
        cvChoice === 'custom' && customFile
          ? customFile.name
          : profile?.cvFileName || user?.profile?.cvFileName || 'Candidate_Resume.pdf';

      const payload = {
        coverLetter: coverLetter.trim() || undefined,
        cvChoice,
        cvFileName: activeCvName,
        cvUrl: profile?.cvUrl || user?.profile?.cvUrl || null,
      };

      const res = await api(`/api/jobs/${id}/apply`, {
        method: 'POST',
        body: payload,
      });

      setHasApplied(true);
      setApplicationStatus('Submitted');
      toast.success('Application submitted successfully!');

      // Smoothly navigate back to applications tracker after brief delay
      setTimeout(() => {
        navigate('/applications');
      }, 1200);
    } catch (err) {
      const msg = err.message || 'Failed to submit application';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Preparing application form…</span>
      </div>
    );
  }

  if (errorMessage && !job) {
    return (
      <div className="max-w-3xl mx-auto my-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
        <div className="flex items-center gap-3 text-rose-600 mb-3">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-900">Unable to load job</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">{errorMessage}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Open Roles</span>
        </Link>
      </div>
    );
  }

  const company = job?.company || {};
  const profileResumeName =
    profile?.cvFileName || user?.profile?.cvFileName || 'Adaeze_Okonkwo_Resume.pdf';

  return (
    <div className="max-w-5xl mx-auto my-6 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Details</span>
        </Link>

        <span className="text-xs font-semibold text-slate-500">
          Applying to <b className="text-slate-800">{company.name || 'Verified Employer'}</b>
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Job Snapshot Card (Sticky) */}
        <aside className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs lg:sticky lg:top-24 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {job.workMode || 'Full-time'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {job.city || 'Remote (Nigeria)'}
              </span>
            </div>

            <h1 className="text-xl font-black text-slate-900 tracking-tight mb-1">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{company.name || 'Hiring Company'}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Employer</span>
              </span>
            </div>
          </div>

          {job.salary && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Compensation
              </span>
              <span className="text-sm font-bold text-slate-900">{job.salary}</span>
            </div>
          )}

          {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Required Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50/70 text-indigo-950 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs text-indigo-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Recruitment Guarantee</span>
            </div>
            <p className="text-indigo-800/80 leading-relaxed text-[11px]">
              Your application goes directly to the verified hiring manager. No intermediaries, no
              placement fees, and end-to-end status tracking.
            </p>
          </div>
        </aside>

        {/* RIGHT COLUMN: Application Submission Card */}
        <main className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {hasApplied ? (
            <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">Application Already Submitted</h3>
                <p className="text-xs text-emerald-800 mt-1">
                  You applied for this role. Current stage: <b>{applicationStatus || 'Submitted'}</b>.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/applications"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
                >
                  View in Applications Tracker
                </Link>
                <Link
                  to={`/jobs/${id}`}
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold"
                >
                  Job Details
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Submit Your Application
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm your details and submit directly to {company.name || 'the hiring team'}.
                </p>
              </div>

              {/* 1. Candidate Contact Information Review */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Applicant Profile
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Verified Contact Info</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                    <b className="text-slate-900">{user?.name || 'Adaeze Okonkwo'}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                    <b className="text-slate-900">{user?.email || 'adaeze@example.com'}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                    <b className="text-slate-900">{user?.phone || '+234 802 345 6789'}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                    <b className="text-slate-900">{profile?.city || user?.profile?.city || 'Lagos, Nigeria'}</b>
                  </div>
                </div>
              </div>

              {/* 2. Resume / CV Attachment Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Resume / CV
                </label>

                {/* Option A: One-Tap Profile CV */}
                <div
                  onClick={() => setCvChoice('profile')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    cvChoice === 'profile'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="cvChoice"
                    checked={cvChoice === 'profile'}
                    onChange={() => setCvChoice('profile')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <b className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Use Saved Profile Resume</span>
                      </b>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                        One-Tap Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {profileResumeName}
                    </p>
                  </div>
                </div>

                {/* Option B: Upload Tailored CV for this Role */}
                <div
                  onClick={() => setCvChoice('custom')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    cvChoice === 'custom'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="cvChoice"
                    checked={cvChoice === 'custom'}
                    onChange={() => setCvChoice('custom')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1 min-w-0">
                    <b className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span>Upload a Custom Resume for this Job</span>
                    </b>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Attach a tailored PDF or DOCX specifically for this opening.
                    </p>

                    {cvChoice === 'custom' && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80">
                        {customFile ? (
                          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
                            <span className="font-semibold text-slate-800 truncate flex items-center gap-1.5">
                              <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                              {customFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCustomFile(null);
                              }}
                              className="text-rose-600 hover:text-rose-800 font-bold text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-xs font-semibold text-indigo-600">
                              Click to choose file or drag & drop
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              PDF, DOC, DOCX up to 5MB
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Cover Note / Personalized Pitch */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                    <span>Pitch to Hiring Team (Optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {coverLetter.length}/500
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={`Hi ${company.name || 'Hiring Team'}, I would love to contribute to this role because...`}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition resize-none leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 block">
                  A brief note highlighting your relevant projects or tech stack experience helps your application stand out.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* 4. Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-coral hover:opacity-95 text-white font-bold text-sm transition shadow-md shadow-coral-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Submitting Application…' : 'Submit Application'}</span>
                  <Send className="w-4 h-4" />
                </button>

                <Link
                  to={`/jobs/${id}`}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
