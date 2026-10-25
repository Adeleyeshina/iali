import { Layers } from 'lucide-react';

// Hero header for solutions page
export default function SolutionsHero() {
  return (
    <section className="pt-16 pb-16 max-w-[1120px] mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-5">
        <Layers className="w-3.5 h-3.5 text-indigo-600" />
        <span>ialihub Platform Solutions</span>
      </div>

      <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-950 mb-5">
        Features Built for African Hiring Transparency
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Deep dive into the 3 flagship add-on tools that eliminate the black box of recruitment for Nigerian job seekers and verified hiring teams.
      </p>
    </section>
  );
}
