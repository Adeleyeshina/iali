import { Link } from 'react-router-dom';

// High-converting call to action banner
export default function CtaSection() {
  return (
    <section className="py-16 md:py-20 max-w-[1120px] mx-auto px-4 sm:px-6">
      <div className="rounded-3xl bg-gradient-brand text-white p-8 sm:p-12 md:p-14 text-center shadow-xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-5 relative z-10">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">
            Ready to Transform Your Career or Hiring?
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
            Join thousands of Nigerian job seekers and verified employers who are landing top roles and closing hires with ialihub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-950/40 hover:bg-indigo-950/60 border border-white/30 text-white font-bold text-xs sm:text-sm transition cursor-pointer backdrop-blur-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
