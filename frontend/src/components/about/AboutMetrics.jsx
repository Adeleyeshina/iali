// Core network metrics showcasing verified candidates and employers
export default function AboutMetrics() {
  const metrics = [
    { value: '25,000+', label: 'Nigerian Tech Professionals' },
    { value: '1,200+', label: 'Verified Tech & Corporate Employers' },
    { value: '9 Days', label: 'Average Time-to-Interview' },
    { value: '₦0', label: 'Fees for Job Seekers, Forever' },
  ];

  return (
    <section className="bg-gradient-brand text-white py-10 shadow-lg">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <b className="font-heading font-extrabold text-3xl sm:text-4xl text-white block">
                {m.value}
              </b>
              <span className="text-xs sm:text-sm text-indigo-100 font-medium">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
