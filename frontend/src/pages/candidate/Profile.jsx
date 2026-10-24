import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Copy,
  UploadCloud,
  Lock,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { toast } from '../../context/ToastContext.jsx';
import { copyToClipboard } from '../../lib/clipboard.js';
import { api } from '../../lib/api.js';
import { LAUNCH } from '../../data/launchAreas.js';

// Candidate profile settings and preferences screen
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/api/profile')
      .then((data) => setProfile(data))
      .catch(() => setProfile({}));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api('/api/profile', { method: 'PUT', body: profile });
      const msg = 'Saved at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStatusMessage(msg);
      toast.success('Profile saved successfully!');
    } catch (err) {
      setStatusMessage(err.message || 'Failed to save profile');
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="h-48 bg-zinc-100 rounded-3xl animate-pulse" />;
  }

  const profileStrength = [
    profile.headline,
    profile.city,
    (profile.skills || []).length > 0,
  ].filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs my-4">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My profile</h1>
          <User className="w-5 h-5 text-zinc-700" />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                `${profile.headline || 'Job Seeker'}\nSkills: ${(profile.skills || []).join(', ')}\nLocation: ${profile.city || 'Nigeria'}`,
                'Profile summary copied!'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Summary</span>
          </button>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Re-import from CV</span>
          </Link>
        </div>
      </div>

      <p className="text-xs md:text-sm text-zinc-500 mb-6 flex items-center gap-2 flex-wrap">
        <span>Profile strength: {profileStrength}/3</span>
        <span>·</span>
        {profile.searchable === false ? (
          <span className="inline-flex items-center gap-1 text-zinc-600 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Hidden from search</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Visible to verified recruiters</span>
          </span>
        )}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Headline
          </label>
          <input
            placeholder="e.g. Frontend developer · React · Lagos"
            value={profile.headline || ''}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
            Skills (comma separated)
          </label>
          <input
            placeholder="React, JavaScript, CSS"
            value={(profile.skills || []).join(', ')}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: e.target.value
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean),
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              City
            </label>
            <select
              value={profile.city || ''}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition cursor-pointer"
            >
              <option value="">Choose…</option>
              {LAUNCH.map((launchCity) => (
                <option key={launchCity.city} value={launchCity.city}>
                  {launchCity.city} (Launch Area)
                </option>
              ))}
              <option value="Abuja">Abuja (waitlist)</option>
              <option value="Port Harcourt">Port Harcourt (waitlist)</option>
              <option value="Enugu">Enugu (waitlist)</option>
              <option value="Kano">Kano (waitlist)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Work mode
            </label>
            <select
              value={profile.workModePref || 'remote'}
              onChange={(e) => setProfile({ ...profile, workModePref: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition cursor-pointer capitalize"
            >
              <option value="onsite">onsite</option>
              <option value="hybrid">hybrid</option>
              <option value="remote">remote</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Employment / Job Search Status
            </label>
            <select
              value={profile.availability || 'Actively looking for a job'}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition cursor-pointer"
            >
              <option value="Actively looking for a job">Actively looking for a job (Immediate start)</option>
              <option value="Employed, but open to opportunities">Employed, open to opportunities</option>
              <option value="Employed, not looking">Employed, not looking (Networking only)</option>
              <option value="Just exploring / curious">Just exploring / curious</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Who can message me
            </label>
            <select
              value={profile.contactPref || 'any'}
              onChange={(e) => setProfile({ ...profile, contactPref: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition cursor-pointer"
            >
              <option value="any">Any verified recruiter</option>
              <option value="approved">Approved only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2.5 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(profile.willingRelocate)}
              onChange={(e) => setProfile({ ...profile, willingRelocate: e.target.checked })}
              className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950 border-zinc-300"
            />
            <span>Open to relocate</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.searchable !== false}
              onChange={(e) => setProfile({ ...profile, searchable: e.target.checked })}
              className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950 border-zinc-300"
            />
            <span>Show me in recruiter search</span>
          </label>
        </div>

        <button
          className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
          onClick={handleSave}
          disabled={saving}
        >
          <Check className="w-4 h-4" />
          <span>{saving ? 'Saving profile…' : 'Save profile'}</span>
        </button>

        {statusMessage && (
          <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{statusMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
}
