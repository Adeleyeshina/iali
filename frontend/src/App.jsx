import { useEffect, useState } from 'react';
import { Link, NavLink, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Briefcase,
  Search as SearchIcon,
  FileText,
  Building2,
  Target,
  MessageSquare,
  Home as HomeIcon,
  Shield,
  User,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
  Star,
} from 'lucide-react';
import Logo from './components/Logo.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import JobsList from './pages/JobsList.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Inbox from './pages/Inbox.jsx';
import Onboarding from './pages/candidate/Onboarding.jsx';
import Profile from './pages/candidate/Profile.jsx';
import Applications from './pages/candidate/Applications.jsx';
import Search from './pages/recruiter/Search.jsx';
import PostJob from './pages/recruiter/PostJob.jsx';
import MyJobs from './pages/recruiter/MyJobs.jsx';
import JobApplicants from './pages/recruiter/JobApplicants.jsx';
import Queues from './pages/admin/Queues.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { api } from './lib/api.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('iali_token');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    api('/api/me')
      .then((user) => setCurrentUser(user))
      .catch(() => {
        localStorage.removeItem('iali_token');
        setCurrentUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('iali_token');
    setCurrentUser(null);
    navigate('/signup');
  };

  const getNavigationTabs = () => {
    if (!currentUser) return [];

    if (currentUser?.role === 'recruiter') {
      return [
        { to: '/', label: 'Hub', Icon: HomeIcon },
        { to: '/recruiter/jobs', label: 'My Jobs', Icon: Briefcase },
        { to: '/post-job', label: 'Post', Icon: PlusCircle },
        { to: '/search', label: 'Talent', Icon: SearchIcon },
        { to: '/inbox', label: 'Inbox', Icon: MessageSquare },
      ];
    }

    if (currentUser?.role === 'admin') {
      return [
        { to: '/', label: 'Home', Icon: HomeIcon },
        { to: '/admin', label: 'Admin', Icon: Shield },
        { to: '/jobs', label: 'Jobs', Icon: Briefcase },
        { to: '/search', label: 'Talent', Icon: SearchIcon },
        { to: '/inbox', label: 'Inbox', Icon: MessageSquare },
      ];
    }

    // Default candidate tabs
    return [
      { to: '/', label: 'Home', Icon: HomeIcon },
      { to: '/jobs', label: 'Jobs', Icon: Briefcase },
      { to: '/applications', label: 'Track', Icon: FileText },
      { to: '/inbox', label: 'Inbox', Icon: MessageSquare },
      { to: '/profile', label: 'Profile', Icon: User },
    ];
  };

  const navigationTabs = getNavigationTabs();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans pb-16 md:pb-0">
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <Logo />

              {/* Desktop Navigation */}
              {currentUser && (
                <nav className="hidden md:flex items-center gap-1">
                  {currentUser.role === 'candidate' && (
                    <>
                      <NavLink
                        to="/jobs"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive && !location.search.includes('view=saved') ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <Briefcase className="w-4 h-4 text-zinc-500" />
                        <span>Find Jobs</span>
                      </NavLink>
                      <NavLink
                        to="/jobs?view=saved"
                        className={() =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            location.pathname === '/jobs' && location.search.includes('view=saved')
                              ? 'bg-zinc-100 text-zinc-950 font-bold'
                              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span>Saved</span>
                      </NavLink>
                      <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <FileText className="w-4 h-4 text-zinc-500" />
                        <span>My Applications</span>
                      </NavLink>
                      <NavLink
                        to="/inbox"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        <span>Inbox</span>
                      </NavLink>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <User className="w-4 h-4 text-zinc-500" />
                        <span>My Profile</span>
                      </NavLink>
                    </>
                  )}

                  {currentUser.role === 'recruiter' && (
                    <>
                      <NavLink
                        to="/recruiter/jobs"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <Briefcase className="w-4 h-4 text-zinc-500" />
                        <span>My Jobs & Applicants</span>
                      </NavLink>
                      <NavLink
                        to="/post-job"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <PlusCircle className="w-4 h-4 text-zinc-500" />
                        <span>Post Job</span>
                      </NavLink>
                      <NavLink
                        to="/search"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <SearchIcon className="w-4 h-4 text-zinc-500" />
                        <span>Search Talent</span>
                      </NavLink>
                      <NavLink
                        to="/inbox"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        <span>Inbox</span>
                      </NavLink>
                    </>
                  )}

                  {currentUser.role === 'admin' && (
                    <>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <Shield className="w-4 h-4 text-zinc-500" />
                        <span>Admin Queues</span>
                      </NavLink>
                      <NavLink
                        to="/jobs"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <Briefcase className="w-4 h-4 text-zinc-500" />
                        <span>Jobs</span>
                      </NavLink>
                      <NavLink
                        to="/search"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <SearchIcon className="w-4 h-4 text-zinc-500" />
                        <span>Search Talent</span>
                      </NavLink>
                      <NavLink
                        to="/inbox"
                        className={({ isActive }) =>
                          `text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                            isActive ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`
                        }
                      >
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        <span>Inbox</span>
                      </NavLink>
                    </>
                  )}
                </nav>
              )}
            </div>

            {/* Right Header Status / Auth Actions */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === 'recruiter' ? (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Employer</span>
                  </span>
                ) : currentUser.role === 'admin' ? (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                    <Target className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Job Seeker</span>
                  </span>
                )}

                <span className="hidden lg:block text-xs text-zinc-500 font-medium">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-900 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-900 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Log in</span>
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-xs font-semibold text-white transition shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Sign up free</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Main Page Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:px-6 md:py-8">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/signup" element={<Signup user={currentUser} onAuth={setCurrentUser} />} />
            <Route path="/login" element={<Login user={currentUser} onAuth={setCurrentUser} />} />

            {/* Gated Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading}>
                  <Home user={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading}>
                  <JobsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading}>
                  <JobDetail />
                </ProtectedRoute>
              }
            />

            {/* Shared Authenticated Routes */}
            <Route
              path="/inbox"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading}>
                  <Inbox user={currentUser} />
                </ProtectedRoute>
              }
            />

            {/* Candidate-only Routes */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['candidate', 'admin']}>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['candidate', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['candidate', 'admin']}>
                  <Applications />
                </ProtectedRoute>
              }
            />

            {/* Recruiter-only Routes */}
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['recruiter', 'admin']}>
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['recruiter', 'admin']}>
                  <JobApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['recruiter', 'admin']}>
                  <PostJob user={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['recruiter', 'admin']}>
                  <Search />
                </ProtectedRoute>
              }
            />

            {/* Admin-only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={currentUser} loading={authLoading} allowedRoles={['admin']}>
                  <Queues />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Footer */}
          <footer className="mt-14 pt-6 border-t border-zinc-200 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© 2026 Iali · Nigeria's Free Hiring Platform</span>
            <span>Lagos & Ibadan Onsite · Nationwide Remote · Zero Fees</span>
          </footer>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        {currentUser && navigationTabs.length > 0 && (
          <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 flex items-center justify-around py-1.5 shadow-lg">
            {navigationTabs.map((tab) => {
              const TabIcon = tab.Icon;
              return (
                <NavLink
                  key={tab.to + tab.label}
                  to={tab.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition ${
                      isActive ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-700'
                    }`
                  }
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>
    </ToastProvider>
  );
}
