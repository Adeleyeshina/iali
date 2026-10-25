import { Heart } from 'lucide-react';

// Hero title and introductory mission for the about page
export default function AboutHero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-6">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Our Story & Mission</span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-950 mb-6 leading-tight">
          Transforming How Nigerian Talent & Companies Connect
        </h1>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We are building Nigeria’s most transparent talent ecosystem. Where job seekers are never ghosted, match scores are clear, and verified employers find ready talent in days.
        </p>
      </div>
    </section>
  );
}
