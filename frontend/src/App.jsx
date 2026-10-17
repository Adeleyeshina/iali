import { useEffect, useState } from 'react';
import { Link, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Logo from './components/Logo.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import JobsList from './pages/JobsList.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Onboarding from './pages/candidate/Onboarding.jsx';
import Profile from './pages/candidate/Profile.jsx';
import Applications from './pages/candidate/Applications.jsx';
import Search from './pages/recruiter/Search.jsx';
import PostJob from './pages/recruiter/PostJob.jsx';
import Queues from './pages/admin/Queues.jsx';
import { api } from './lib/api.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate('/');
  };

  const getNavigationTabs = () => {
    if (currentUser?.role === 'recruiter') {
      return [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/jobs', label: 'Jobs', icon: '💼' },
        { to: '/post-job', label: 'Post', icon: '＋' },
        { to: '/search', label: 'Search', icon: '🔍' },
      ];
    }

    if (currentUser?.role === 'admin') {
      return [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/jobs', label: 'Jobs', icon: '💼' },
        { to: '/admin', label: 'Admin', icon: '🛡' },
      ];
    }

    return [
      { to: '/', label: 'Home', icon: '🏠' },
      { to: '/jobs', label: 'Jobs', icon: '💼' },
      { to: '/applications', label: 'Track', icon: '📄' },
      { to: '/profile', label: 'Me', icon: '👤' },
    ];
  };

  const navigationTabs = getNavigationTabs();

  return (
    <>
      <header className="hdr">
        <div className="hdr-in">
          <Logo />

          <nav className="nav-links">
            <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'on' : '')}>
              Find jobs
            </NavLink>

            {(!currentUser || currentUser.role === 'recruiter') && (
              <NavLink to={currentUser ? '/search' : '/signup'} className={({ isActive }) => (isActive ? 'on' : '')}>
                Hire talent
              </NavLink>
            )}

            {currentUser?.role === 'candidate' && (
              <>
                <NavLink to="/applications">Applications</NavLink>
                <NavLink to="/onboarding">CV setup</NavLink>
              </>
            )}

            {currentUser?.role === 'recruiter' && (
              <>
                <NavLink to="/post-job">Post a job</NavLink>
                <NavLink to="/search">Search</NavLink>
              </>
            )}

            {currentUser?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </nav>

          <span className="hdr-sp" />

          {currentUser ? (
            <>
              <span className="me-chip">{currentUser.email}</span>
              <button className="btn sm ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn sm ghost" to="/login">
                Log in
              </Link>
              <Link className="btn sm" to="/signup">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login onAuth={setCurrentUser} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute user={currentUser} loading={authLoading}>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={currentUser} loading={authLoading}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute user={currentUser} loading={authLoading}>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute user={currentUser} loading={authLoading}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute user={currentUser} loading={authLoading}>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={currentUser} loading={authLoading}>
                <Queues />
              </ProtectedRoute>
            }
          />
        </Routes>

        <footer className="ftr">
          <span>© 2026 Iali · Free hiring for Nigeria</span>
          <span>Lagos + Ibadan onsite · Remote nationwide · No fees, no scams</span>
        </footer>
      </div>

      <nav className="tabbar">
        {navigationTabs.map((tab) => (
          <NavLink key={tab.to + tab.label} to={tab.to} className={({ isActive }) => (isActive ? 'on' : '')}>
            <span className="ic">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
