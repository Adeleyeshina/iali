import { useState } from 'react';
import { X, MapPin, Bell, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

const POPULAR_WAITLIST_CITIES = [
  'Abuja (FCT)',
  'Port Harcourt',
  'Enugu',
  'Kano',
  'Kaduna',
  'Benin City',
  'Jos',
  'Calabar',
  'Owerri',
  'Abeokuta',
];

// Modal for joining city waitlist outside Lagos & Ibadan
export default function WaitlistModal({ isOpen, onClose, initialCity = '' }) {
  const [city, setCity] = useState(initialCity || POPULAR_WAITLIST_CITIES[0]);
  const [customCity, setCustomCity] = useState('');
  const [roleInterest, setRoleInterest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const targetCity = city === 'Other' ? customCity.trim() : city;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetCity) {
      toast.error('Please specify your city.');
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

      toast.success(`You are on the waitlist for ${targetCity}! We'll alert you when onsite hiring launches.`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to join waitlist');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Join City Waitlist
          </h2>
        </div>

        <p className="text-xs md:text-sm text-zinc-500 mb-4">
          Iali currently supports onsite & hybrid roles in <b>Lagos and Ibadan</b>. Register your city to unlock local hiring next.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Select Your City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 transition cursor-pointer"
            >
              {POPULAR_WAITLIST_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Other">Other city…</option>
            </select>
          </div>

          {city === 'Other' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                City Name *
              </label>
              <input
                placeholder="e.g. Asaba, Uyo, Warri"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                disabled={submitting}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Target Role / Skills (Optional)
            </label>
            <input
              placeholder="e.g. Accountant, Software Engineer, Sales Manager"
              value={roleInterest}
              onChange={(e) => setRoleInterest(e.target.value)}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs md:text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition"
            />
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-2 text-xs text-zinc-600">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>You can apply to any nationwide remote role immediately while waiting!</span>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (city === 'Other' && !customCity.trim())}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Joining…' : 'Notify Me'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
