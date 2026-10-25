import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Mail, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from '../Logo.jsx';

// Public marketing footer with links and newsletter
export default function PublicFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#090D1A] text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white p-2 rounded-2xl">
              <Logo size="sm" />
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              ialihub is Nigeria's premier rule-based talent marketplace. We connect verified job seekers with leading employers across Lagos, Abuja, Port Harcourt, and nationwide remote.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Join 15,000+ Nigerian Tech Professionals
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are subscribed to Nigerian hiring trends and salary benchmarks!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email…"
                    required
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-indigo-500/20"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3">
            <b className="text-xs font-bold uppercase tracking-wider text-white block">
              Flagship Solutions
            </b>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/solutions" className="hover:text-white transition">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white transition">
                  Match Score (60/25/15)
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white transition">
                  Completeness Meter (80%+)
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white transition">
                  Verified Recruiter Chat
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Explore Open Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <b className="text-xs font-bold uppercase tracking-wider text-white block">
              Company & Hub
            </b>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About ialihub
                </Link>
              </li>
              <li>
                <Link to="/about#mission" className="hover:text-white transition">
                  Our Mission & Values
                </Link>
              </li>
              <li>
                <Link to="/about#verification" className="hover:text-white transition">
                  Employer Verification
                </Link>
              </li>
              <li>
                <Link to="/signup?role=recruiter" className="hover:text-white transition">
                  Post a Job Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Column */}
          <div className="space-y-3">
            <b className="text-xs font-bold uppercase tracking-wider text-white block">
              Nigeria Hubs
            </b>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Victoria Island & Yaba Innovation Hub, Lagos, Nigeria</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@ialihub.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+234 (0) 810 500 4254</span>
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-emerald-400 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Scam-Free Verified Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>© 2026 ialihub Technologies Ltd. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>Built with pride for Nigerian talent & employers</span>
            <span>·</span>
            <span>Lagos · Abuja · Nationwide Remote</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
