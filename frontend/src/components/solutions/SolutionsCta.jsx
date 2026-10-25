import { Link } from 'react-router-dom';

// Bottom call-to-action on the solutions page
export default function SolutionsCta() {
  return (
    <section className="pt-16 max-w-[1120px] mx-auto px-4 text-center">
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-brand text-white shadow-xl space-y-5">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Experience the Future of Nigerian Recruitment
        </h2>
        <p className="text-indigo-100 text-sm max-w-xl mx-auto">
          Ready to find your match or hire pre-vetted talent? Get started in under 2 minutes.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/signup"
            className="px-8 py-3.5 rounded-2xl bg-white text-indigo-950 font-extrabold text-sm shadow-md hover:bg-slate-100 transition"
          >
            Create Account Free
          </Link>
        </div>
      </div>
    </section>
  );
}
