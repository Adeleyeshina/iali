import { Link } from 'react-router-dom';

// High-converting call to action banner
export default function CtaSection() {
  return (
    <section className="py-18 md:py-24 max-w-[1120px] mx-auto px-4 sm:px-6">
      <div className="rounded-3xl bg-gradient-brand text-white p-8 sm:p-14 md:p-16 text-center shadow-xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            Ready to Transform Your Career or Hiring?
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg leading-relaxed font-normal">
            Join thousands of Nigerian job seekers and verified employers who are landing top roles and closing hires with ialihub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-sm sm:text-base shadow-md transition cursor-pointer"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-950/40 hover:bg-indigo-950/60 border border-white/30 text-white font-bold text-sm sm:text-base transition cursor-pointer backdrop-blur-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
