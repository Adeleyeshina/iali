import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';
import WorkspaceLayout from '../components/layout/WorkspaceLayout.jsx';

import Home from '../pages/Home.jsx';
import JobsList from '../pages/JobsList.jsx';
import JobDetail from '../pages/JobDetail.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Inbox from '../pages/Inbox.jsx';
import Onboarding from '../pages/candidate/Onboarding.jsx';
import Profile from '../pages/candidate/Profile.jsx';
import Applications from '../pages/candidate/Applications.jsx';
import JobApply from '../pages/candidate/JobApply.jsx';
import Search from '../pages/recruiter/Search.jsx';
import PostJob from '../pages/recruiter/PostJob.jsx';
import MyJobs from '../pages/recruiter/MyJobs.jsx';
import JobApplicants from '../pages/recruiter/JobApplicants.jsx';
import Queues from '../pages/admin/Queues.jsx';
import Landing from '../pages/public/Landing.jsx';
import About from '../pages/public/About.jsx';
import Solutions from '../pages/public/Solutions.jsx';
import { isAppSubdomain } from '../lib/subdomain.js';

// Catch-all redirect for any legacy /app/* paths to clean top-level routes
function AppPrefixRedirect() {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/^\/app\/?/, '/') || '/dashboard';
  return <Navigate to={`${cleanPath}${location.search}${location.hash}`} replace />;
}

// Clean, DRY routing architecture with dedicated nested layouts
export default function AppRoutes() {
  const onAppSubdomain = isAppSubdomain();

  return (
    <Routes>
      {/* 1. Public Marketing Routes (Wrapped in dedicated PublicLayout with Navbar & Footer) */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            onAppSubdomain ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Landing />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Route>

      {/* 2. Standalone Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 3. Authenticated Workspaces (Wrapped once in ProtectedRoute + WorkspaceLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      >
        {/* Workspace Hub Dashboard */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/inbox" element={<Inbox />} />

        {/* Candidate Tools */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute allowedRoles={['candidate', 'admin']}>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['candidate', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={['candidate', 'admin']}>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute allowedRoles={['candidate', 'admin']}>
              <JobApply />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Tools */}
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route path="/my-jobs" element={<Navigate to="/recruiter/jobs" replace />} />
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
              <JobApplicants />
            </ProtectedRoute>
          }
        />

        {/* Admin Tools */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Queues />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 4. Legacy /app redirect: cleanly strips /app prefix with zero route duplication */}
      <Route path="/app/*" element={<AppPrefixRedirect />} />
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />

      {/* 5. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
