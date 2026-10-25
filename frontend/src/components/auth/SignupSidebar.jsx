import { Rocket, Check, ShieldCheck } from 'lucide-react';

// Left marketing column on auth signup page in Electric Indigo & Warm Coral theme
export default function SignupSidebar() {
  const benefits = [
    {
      title: 'Free Direct Discovery',
      desc: 'Candidates get approached directly with zero agency middleman cuts.',
    },
    {
      title: 'CAC & CIPM Verification',
      desc: 'All employer listings are vetted for legitimate compensation and safe workplaces.',
    },
    {
      title: 'Precision Match Scores',
      desc: 'Algorithmic 60/25/15 scoring matching your stack and location.',
    },
  ];

  return (
    <div className="bg-gradient-hero text-white p-7 md:p-9 flex flex-col justify-between gap-6 border-r border-indigo-900/40 relative overflow-hidden">
      {/* Soft ambient lighting */}
      <div className="absolute -right-14 -top-14 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-6 -bottom-14 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-2">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white">Join ialihub free</h2>
          <Rocket className="w-5 h-5 text-coral-400" />
        </div>
        <p className="text-indigo-200/90 text-xs md:text-sm leading-relaxed mb-8 font-normal">
          Nigeria's premier rule-based hiring marketplace. Candidates get discovered without agencies; verified employers hire top tech talent.
        </p>

        <div className="space-y-4">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <b className="text-xs font-bold text-white block">{b.title}</b>
                <span className="text-[11px] text-indigo-200/80 leading-snug block">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-6 border-t border-indigo-800/40 flex items-center justify-between text-xs text-indigo-200/80">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Privacy First & NDPR Compliant</span>
        </span>
        <span className="font-semibold text-white">Lagos · Abuja · Remote</span>
      </div>
    </div>
  );
}
