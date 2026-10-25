import { useState } from 'react';
import { MapPin, Bell } from 'lucide-react';
import WaitlistModal from './WaitlistModal.jsx';

// Nationwide coverage banner celebrating all 36 states and remote opportunities
export default function WaitlistBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-hero text-white rounded-2xl p-4 md:p-5 mb-6 border border-indigo-900/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-white flex items-center justify-center shrink-0 mt-0.5 border border-indigo-400/30">
            <MapPin className="w-5 h-5 text-coral-400" />
          </div>
          <div>
            <b className="text-sm md:text-base font-bold text-white block">
              Hiring Across All 36 States & FCT
            </b>
            <p className="text-xs text-indigo-200/90 mt-0.5 max-w-xl leading-relaxed">
              ialihub connects candidates and employers everywhere in Nigeria. Browse verified onsite, hybrid, and remote roles across Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Kano, and nationwide.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Bell className="w-3.5 h-3.5 text-coral-500" />
          <span>Get Location Job Alerts</span>
        </button>
      </div>

      <WaitlistModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
