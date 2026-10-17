import { Navigate, useLocation } from 'react-router-dom';

// ProtectedRoute guards routes requiring authentication and stores return location
export default function ProtectedRoute({ user, loading, children }) {
  const location = useLocation();

  if (loading) {
    return <div className="sk" style={{ minHeight: 120 }} />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
