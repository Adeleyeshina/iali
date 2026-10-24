import { useState } from 'react';
import { MapPin, Bell } from 'lucide-react';
import WaitlistModal from './WaitlistModal.jsx';

// Prominent city waitlist banner for non-launch area candidates
export default function WaitlistBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-900 text-white rounded-2xl p-4 md:p-5 mb-6 border border-zinc-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <b className="text-sm md:text-base font-bold text-white block">
              Based outside Lagos or Ibadan?
            </b>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-xl leading-relaxed">
              Vote for your city (Abuja, Port Harcourt, Enugu, Kano) to be unlocked next for onsite hiring, or browse nationwide remote jobs today.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Bell className="w-3.5 h-3.5 text-zinc-900" />
          <span>Join City Waitlist</span>
        </button>
      </div>

      <WaitlistModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
