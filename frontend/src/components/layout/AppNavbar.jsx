import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Search as SearchIcon,
  FileText,
  Building2,
  Target,
  MessageSquare,
  Shield,
  User,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
  Star,
} from 'lucide-react';
import Logo from '../Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Authenticated application navigation header
export default function AppNavbar({ currentUser: propUser, onLogout: propLogout }) {
  const location = useLocation();
  const auth = useAuth();
  const currentUser = propUser !== undefined ? propUser : auth.user;
  const onLogout = propLogout !== undefined ? propLogout : auth.logout;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-[1120px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-6">
          <Logo to="/dashboard" />

          {/* Desktop Navigation Links */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1.5">
              {currentUser.role === 'candidate' && (
                <>
                  <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive && !location.search.includes('view=saved')
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Find Jobs</span>
                  </NavLink>
                  <NavLink
                    to="/jobs?view=saved"
                    className={() =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        location.pathname === '/jobs' && location.search.includes('view=saved')
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Star className="w-4 h-4 text-coral-500 fill-coral-400" />
                    <span>Saved</span>
                  </NavLink>
                  <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>My Applications</span>
                  </NavLink>
                  <NavLink
                    to="/inbox"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Inbox</span>
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </NavLink>
                </>
              )}

              {currentUser.role === 'recruiter' && (
                <>
                  <NavLink
                    to="/recruiter/jobs"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>My Jobs</span>
                  </NavLink>
                  <NavLink
                    to="/post-job"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <PlusCircle className="w-4 h-4 text-slate-400" />
                    <span>Post Job</span>
                  </NavLink>
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <SearchIcon className="w-4 h-4 text-slate-400" />
                    <span>Search Talent</span>
                  </NavLink>
                  <NavLink
                    to="/inbox"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Inbox</span>
                  </NavLink>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Admin Queues</span>
                  </NavLink>
                  <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Jobs</span>
                  </NavLink>
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <SearchIcon className="w-4 h-4 text-slate-400" />
                    <span>Search Talent</span>
                  </NavLink>
                  <NavLink
                    to="/inbox"
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-100/60'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Inbox</span>
                  </NavLink>
                </>
              )}
            </nav>
          )}
        </div>

        {/* Right Header Status / Auth Actions */}
        {currentUser ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {auth.isDemo && (
              <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-900 shadow-2xs">
                <span className="text-amber-700 font-bold mr-1">Demo:</span>
                <button
                  type="button"
                  onClick={() => auth.loginAsDemo('candidate')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    currentUser.role === 'candidate'
                      ? 'bg-amber-200/90 font-black text-amber-950 shadow-2xs'
                      : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/70'
                  }`}
                  title="Switch to Job Seeker view"
                >
                  Candidate
                </button>
                <span className="text-amber-300">|</span>
                <button
                  type="button"
                  onClick={() => auth.loginAsDemo('recruiter')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    currentUser.role === 'recruiter'
                      ? 'bg-amber-200/90 font-black text-amber-950 shadow-2xs'
                      : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/70'
                  }`}
                  title="Switch to Employer view"
                >
                  Employer
                </button>
                <span className="text-amber-300">|</span>
                <button
                  type="button"
                  onClick={() => auth.loginAsDemo('admin')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-200/90 font-black text-amber-950 shadow-2xs'
                      : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/70'
                  }`}
                  title="Switch to Admin Trust Centre view"
                >
                  Admin
                </button>
              </div>
            )}

            {currentUser.role === 'recruiter' ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Employer</span>
              </span>
            ) : currentUser.role === 'admin' ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <Target className="w-3.5 h-3.5 text-slate-600" />
                <span>Job Seeker</span>
              </span>
            )}

            <span className="hidden lg:block text-xs text-slate-500 font-medium">
              {currentUser.email}
            </span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => auth.loginAsDemo('candidate')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-xs font-bold text-indigo-950 transition cursor-pointer"
            >
              <span>Explore Demo</span>
            </button>
            <Link
              to="/login"
              state={{ from: location }}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
            >
              <span>Log in</span>
            </Link>
            <Link
              to="/signup"
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-coral hover:opacity-95 text-xs font-bold text-white transition shadow-xs whitespace-nowrap"
            >
              <span>Sign up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
