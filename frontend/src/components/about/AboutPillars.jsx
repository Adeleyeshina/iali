import { Sparkles, Target, ShieldCheck, Users } from 'lucide-react';

// The 4 architectural pillars behind ialihub's matching model
export default function AboutPillars() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Rule-Based Transparency',
      desc: 'No secret black-box algorithms. Our 60/25/15 match score clearly breaks down skills, role, and location fit so candidates know exactly where they stand.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      icon: Target,
      title: 'Zero Ghosting Guarantee',
      desc: 'Our live application tracker records every review milestone with timestamps and recruiter notes, giving job seekers genuine clarity and respect.',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      icon: ShieldCheck,
      title: '100% Verified Employers',
      desc: 'Every company is vetted before posting jobs or reaching out. We strictly protect Nigerian talent from scams, unpaid tests, and predatory listings.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: Users,
      title: 'Built for Nigeria’s Tech Hubs',
      desc: 'Deeply tailored to the realities of Lagos, Abuja, Port Harcourt, and Nationwide Remote work cultures, currency standards, and tech stacks.',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
            Our Foundations
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-950 mb-3">
            The 4 Pillars That Power ialihub
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every feature we build is designed to make talent discovery fair, fast, and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-950">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
