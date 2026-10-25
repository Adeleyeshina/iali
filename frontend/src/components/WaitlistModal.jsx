import { useState } from 'react';
import { X, MapPin, Bell, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';
import { NIGERIAN_CITIES } from '../data/launchAreas.js';

// Modal for setting up location job alerts across any state in Nigeria
export default function WaitlistModal({ isOpen, onClose, initialCity = '' }) {
  const [city, setCity] = useState(initialCity || NIGERIAN_CITIES[0]);
  const [customCity, setCustomCity] = useState('');
  const [roleInterest, setRoleInterest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const targetCity = city === 'Other' ? customCity.trim() : city;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetCity) {
      toast.error('Please specify your city or state.');
      return;
    }

    setSubmitting(true);

    try {
      await api('/api/waitlist', {
        method: 'POST',
        body: {
          city: targetCity,
          roleInterest: roleInterest.trim(),
        },
      });

      toast.success(`Location alerts active for ${targetCity}! You will be notified when matching roles are posted.`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to register location alerts');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <Bell className="w-4 h-4 text-coral-500" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">
            Location Job Alerts
          </h2>
        </div>

        <p className="text-xs md:text-sm text-zinc-500 mb-4">
          Get real-time alerts when verified companies post matching onsite, hybrid, or remote tech roles in your location.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Select Your State or City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition cursor-pointer shadow-xs"
            >
              {NIGERIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Other">Other state or town…</option>
            </select>
          </div>

          {city === 'Other' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / State Name *
              </label>
              <input
                placeholder="e.g. Asaba, Uyo, Warri, Akure"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                disabled={submitting}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Target Role / Skills (Optional)
            </label>
            <input
              placeholder="e.g. Accountant, Software Engineer, Sales Manager"
              value={roleInterest}
              onChange={(e) => setRoleInterest(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
            />
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs text-indigo-950 font-medium">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Active nationwide across all 36 states, FCT, and remote roles!</span>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 transition cursor-pointer"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (city === 'Other' && !customCity.trim())}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <Check className="w-3.5 h-3.5 text-coral-300" />
              <span>{submitting ? 'Saving…' : 'Activate Alerts'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
