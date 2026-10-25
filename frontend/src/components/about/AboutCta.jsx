import { Link } from 'react-router-dom';

// Bottom call-to-action banner for the about page
export default function AboutCta() {
  return (
    <section className="py-16 max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-brand text-white p-8 sm:p-12 text-center shadow-2xl space-y-6">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Ready to Experience Transparent Hiring?
        </h2>
        <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
          Create your account today and see your live fit scores for Nigeria’s top job opportunities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/signup"
            className="px-8 py-3.5 rounded-2xl bg-white text-indigo-950 font-extrabold text-sm shadow-md hover:bg-slate-100 transition"
          >
            Get Started Free
          </Link>
          <Link
            to="/jobs"
            className="px-8 py-3.5 rounded-2xl bg-slate-950/30 border border-white/30 text-white font-bold text-sm hover:bg-slate-950/50 transition"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
