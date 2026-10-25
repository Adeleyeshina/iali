import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import JobsList from '../pages/JobsList.jsx';
import JobDetail from '../pages/JobDetail.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Inbox from '../pages/Inbox.jsx';
import Onboarding from '../pages/candidate/Onboarding.jsx';
import Profile from '../pages/candidate/Profile.jsx';
import Applications from '../pages/candidate/Applications.jsx';
import Search from '../pages/recruiter/Search.jsx';
import PostJob from '../pages/recruiter/PostJob.jsx';
import MyJobs from '../pages/recruiter/MyJobs.jsx';
import JobApplicants from '../pages/recruiter/JobApplicants.jsx';
import Queues from '../pages/admin/Queues.jsx';
import Landing from '../pages/public/Landing.jsx';
import About from '../pages/public/About.jsx';
import Solutions from '../pages/public/Solutions.jsx';

// Central routing configuration for public marketing, auth, and authenticated workspaces
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Marketing Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/solutions" element={<Solutions />} />

      {/* Public Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Authenticated Workspace Hubs */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Jobs Discovery Routes */}
      <Route path="/jobs" element={<JobsList />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/app/jobs" element={<JobsList />} />
      <Route path="/app/jobs/:id" element={<JobDetail />} />

      {/* Shared Authenticated Messages */}
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/inbox"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />

      {/* Candidate-only Tools */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/onboarding"
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
        path="/app/profile"
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
        path="/app/applications"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <Applications />
          </ProtectedRoute>
        }
      />

      {/* Recruiter-only Tools */}
      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <MyJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <MyJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/jobs/:id/applicants"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <JobApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/recruiter/jobs/:id/applicants"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <JobApplicants />
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
        path="/app/post-job"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/search"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <Search />
          </ProtectedRoute>
        }
      />

      {/* Admin Queues */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Queues />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Queues />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
