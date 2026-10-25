// Marquee showcasing top Nigerian tech and finance employers
export default function TrustedMarquee() {
  const TRUSTED_COMPANIES = [
    'Paystack',
    'Moniepoint',
    'Flutterwave',
    'Kuda Bank',
    'Piggyvest',
    'Access Bank',
    'Interswitch',
    'Chipper Cash',
  ];

  return (
    <section className="bg-gradient-brand text-white py-6 shadow-md">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-100 whitespace-nowrap">
            Trusted by talent & hiring leaders at:
          </span>
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10 flex-wrap justify-center font-heading font-bold text-sm sm:text-base md:text-lg tracking-tight text-white/95">
            {TRUSTED_COMPANIES.map((company) => (
              <span key={company} className="hover:scale-105 transition-transform">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
