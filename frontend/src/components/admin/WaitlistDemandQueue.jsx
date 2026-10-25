import { MapPin } from 'lucide-react';

// Geographic waitlist and expansion demand tracker
export default function WaitlistDemandQueue({ waitlistMap }) {
  const cities = Object.keys(waitlistMap || {});

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
      <h3 className="text-base font-bold text-zinc-900 mb-1">Job Alert Demand by City & State</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Candidate & employer location alert subscriptions across all Nigerian states.
      </p>

      {cities.length === 0 ? (
        <p className="text-xs text-zinc-400">No waitlist entries registered yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cities.map((city) => (
            <div key={city} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-semibold">{city}</span>
              </div>
              <div className="text-lg font-bold text-zinc-900">{waitlistMap[city]} entries</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
