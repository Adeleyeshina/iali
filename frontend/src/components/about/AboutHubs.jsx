// Nationwide technology ecosystem coverage across Nigeria
export default function AboutHubs() {
  const hubs = [
    { name: 'Lagos State', sub: 'VI, Yaba, Ikeja, Lekki & Mainland' },
    { name: 'Abuja FCT', sub: 'Corporate, Fintech & Public Tech' },
    { name: 'Port Harcourt & South', sub: 'Enterprise Software & Energy Tech' },
    { name: 'All 36 States & Remote', sub: 'Top verified talent anywhere in Nigeria' },
  ];

  return (
    <section className="py-20 max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
          Nationwide Ecosystem
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-950 mb-3">
          Connecting Talent Across All Nigerian States
        </h2>
        <p className="text-sm text-slate-600">
          From onsite engineering squads in Lagos, Abuja, and Port Harcourt to remote teams across every state in the federation.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {hubs.map((h) => (
          <div key={h.name} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <b className="font-bold text-base text-slate-950 block mb-1">{h.name}</b>
            <span className="text-xs text-slate-500">{h.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
