import { Link, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from './components/Logo.jsx';
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
  const [me, setMe] = useState(null);
  const nav = useNavigate();
  useEffect(() => { if (localStorage.getItem('iali_token')) api('/api/me').then(setMe).catch(() => {}); }, []);
  const logout = () => { localStorage.removeItem('iali_token'); setMe(null); nav('/'); };
  const tabs = me?.role === 'recruiter'
    ? [{ to: '/', t: 'Home', i: '🏠' }, { to: '/jobs', t: 'Jobs', i: '💼' }, { to: '/post-job', t: 'Post', i: '＋' }, { to: '/search', t: 'Search', i: '🔍' }]
    : me?.role === 'admin'
      ? [{ to: '/', t: 'Home', i: '🏠' }, { to: '/jobs', t: 'Jobs', i: '💼' }, { to: '/admin', t: 'Admin', i: '🛡' }]
      : [{ to: '/', t: 'Home', i: '🏠' }, { to: '/jobs', t: 'Jobs', i: '💼' }, { to: '/applications', t: 'Track', i: '📄' }, { to: '/profile', t: 'Me', i: '👤' }];
  return (
    <>
      <header className="hdr">
        <div className="hdr-in">
          <Logo />
          <nav className="nav-links">
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'on' : ''}>Find jobs</NavLink>
            {(!me || me.role === 'recruiter') && <NavLink to={me ? '/search' : '/signup'} className={({ isActive }) => isActive ? 'on' : ''}>Hire talent</NavLink>}
            {me?.role === 'candidate' && (<><NavLink to="/applications">Applications</NavLink><NavLink to="/onboarding">CV setup</NavLink></>)}
            {me?.role === 'recruiter' && (<><NavLink to="/post-job">Post a job</NavLink><NavLink to="/search">Search</NavLink></>)}
            {me?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <span className="hdr-sp" />
          {me ? (<><span className="me-chip">{me.email}</span><button className="btn sm ghost" onClick={logout}>Log out</button></>)
            : (<><Link className="btn sm ghost" to="/login">Log in</Link><Link className="btn sm" to="/signup">Get started</Link></>)}
        </div>
      </header>
      <div className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login onAuth={setMe} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Queues />} />
        </Routes>
        <footer className="ftr"><span>© 2026 Iali · Free hiring for Nigeria</span><span>Lagos + Ibadan onsite · Remote nationwide · No fees, no scams</span></footer>
      </div>
      <nav className="tabbar">
        {tabs.map((t) => <NavLink key={t.to + t.t} to={t.to} className={({ isActive }) => isActive ? 'on' : ''}><span className="ic">{t.i}</span>{t.t}</NavLink>)}
      </nav>
    </>
  );
}
