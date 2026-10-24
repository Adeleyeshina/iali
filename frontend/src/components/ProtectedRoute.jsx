import { Navigate, useLocation } from 'react-router-dom';

// ProtectedRoute gates access to authenticated users and enforces role-based boundaries
export default function ProtectedRoute({ user, loading, allowedRoles, children }) {
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
        <div className="sk" style={{ minHeight: 140, borderRadius: 16 }} />
      </div>
    );
  }

  // Gated app: Not logged in -> must sign up / log in first
  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Job seekers cannot access recruiter tools; route to jobs
    if (user.role === 'candidate') {
      return <Navigate to="/jobs" replace />;
    }
    // Recruiters cannot access candidate application tracker; route to candidate search
    if (user.role === 'recruiter') {
      return <Navigate to="/search" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
