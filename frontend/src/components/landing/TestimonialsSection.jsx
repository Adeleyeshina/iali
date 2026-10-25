import { Star } from 'lucide-react';

// Real stories from Nigerian job seekers and hiring teams
export default function TestimonialsSection() {
  const TESTIMONIALS = [
    {
      initials: 'BA',
      name: 'Babatunde Adekunle',
      role: 'Full-Stack Engineer · Lagos',
      bg: 'bg-gradient-brand text-white',
      quote:
        '“The match score saved me weeks of blind applications. I applied to two roles where my match was 85%+ and landed interviews for both. Zero guesswork!”',
    },
    {
      initials: 'AO',
      name: 'Amina Olanrewaju',
      role: 'Product Designer · Abuja',
      bg: 'bg-indigo-600 text-white',
      quote:
        '“The application timeline is a breath of fresh air. In Nigeria you normally apply and wait forever. On ialihub I could see the moment the team viewed my CV and advanced me.”',
    },
    {
      initials: 'CE',
      name: 'Chuka Eze',
      role: 'Talent Lead · Yaba, Lagos',
      bg: 'bg-emerald-600 text-white',
      quote:
        '“The 80%+ completeness filter alone makes ialihub 10x better than LinkedIn for Nigerian hiring. Every candidate we reach out to is actually responsive and ready.”',
    },
  ];

  return (
    <section className="py-20 md:py-24 max-w-[1120px] mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
          Real Stories
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-950 mb-3">
          Proof That ialihub Works
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base">
          Real feedback from Nigerian job seekers and hiring teams who found value on ialihub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((item) => (
          <div
            key={item.name}
            className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed italic">
                {item.quote}
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center font-bold text-xs shrink-0`}
              >
                {item.initials}
              </div>
              <div>
                <b className="text-xs font-bold text-zinc-900 block">{item.name}</b>
                <span className="text-[11px] text-zinc-500">{item.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
