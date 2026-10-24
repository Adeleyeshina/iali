import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';
import { LAUNCH } from '../../data/launchAreas.js';

// Post a new job role screen
export default function PostJob({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workMode: 'onsite',
    city: 'Lagos',
    clientName: '',
  });
  const [createdJob, setCreatedJob] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleCreateJob = async () => {
    if (posting) return;
    setPosting(true);

    try {
      setErrorMessage('');
      const response = await api('/api/jobs', {
        method: 'POST',
        body: formData,
      });
      setCreatedJob(response);
      toast.success('Role published successfully!');
    } catch (err) {
      setErrorMessage(err.message + ' — log in as a recruiter in a company first.');
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleSwitchToRemote = async () => {
    if (switching || !createdJob) return;
    setSwitching(true);

    try {
      const updatedJob = await api(`/api/jobs/${createdJob.id}/to-remote`, {
        method: 'PATCH',
        body: {},
      });
      setCreatedJob({ ...createdJob, ...updatedJob, notice: null });
      toast.success('Job switched to remote — now visible nationwide!');
    } catch (err) {
      toast.error(err.message || 'Failed to switch job to remote');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs my-4">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Post a job</h1>
        <Briefcase className="w-5 h-5 text-zinc-700" />
      </div>
      <p className="text-xs md:text-sm text-zinc-500 mb-4">
        Free forever in this release · initial posts verified before candidate outreach.
      </p>

      {user?.role === 'candidate' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <b className="text-xs md:text-sm">Candidate Account Active</b>
          </div>
          <p className="text-xs mb-3">
            You are currently signed in as a candidate ({user.email}). Only verified recruiter accounts can publish live job posts on Iali.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link
              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition inline-flex items-center gap-1"
              to="/jobs"
            >
              <span>Browse jobs instead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-50 transition"
              to="/login"
              state={{ from: '/post-job' }}
            >
              Switch to Recruiter Account
            </Link>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex gap-2 my-4">
        <span className="h-1.5 flex-1 rounded-full bg-zinc-950" />
        <span
          className={`h-1.5 flex-1 rounded-full transition ${
            formData.title && formData.description ? 'bg-zinc-950' : 'bg-zinc-200'
          }`}
        />
        <span
          className={`h-1.5 flex-1 rounded-full transition ${
            createdJob ? 'bg-zinc-950' : 'bg-zinc-200'
          }`}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Role title
          </label>
          <input
            placeholder="e.g. Frontend Developer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={posting}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            What will they do?
          </label>
          <textarea
            rows="4"
            placeholder="Stack, responsibilities, salary range (optional)…"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={posting}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Work mode
            </label>
            <select
              value={formData.workMode}
              onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
              disabled={posting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition cursor-pointer capitalize"
            >
              <option value="onsite">onsite</option>
              <option value="hybrid">hybrid</option>
              <option value="remote">remote</option>
            </select>
          </div>

          {formData.workMode !== 'remote' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                City
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={posting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition cursor-pointer"
              >
                {LAUNCH.map((launchCity) => (
                  <option key={launchCity.city} value={launchCity.city}>
                    {launchCity.city} (Launch area)
                  </option>
                ))}
                <option value="Enugu">Enugu (Outside launch area)</option>
                <option value="Abuja">Abuja (Outside launch area)</option>
                <option value="Port Harcourt">Port Harcourt (Outside launch area)</option>
                <option value="Kano">Kano (Outside launch area)</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Agency / Client Name (Optional)
          </label>
          <input
            placeholder="Shown as 'posted on behalf of…'"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            disabled={posting}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <button
          className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
          onClick={handleCreateJob}
          disabled={posting || user?.role === 'candidate' || !formData.title.trim() || !formData.description.trim()}
        >
          <span>{posting ? 'Publishing role…' : 'Publish role'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {createdJob && (
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mt-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved as {createdJob.status}</span>
            </span>
            {createdJob.notice ? (
              <>
                <p className="text-xs text-zinc-500 my-2">{createdJob.notice}</p>
                <button
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer"
                  onClick={handleSwitchToRemote}
                  disabled={switching}
                >
                  {switching ? 'Updating to remote…' : 'Switch to remote — reach all Nigeria'}
                </button>
              </>
            ) : (
              <p className="text-xs text-zinc-500 mt-1">
                Live and ranking in the feed.{' '}
                <Link to={`/jobs/${createdJob.id}`} className="font-bold underline text-zinc-900 ml-1 inline-flex items-center gap-1">
                  <span>View it</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
