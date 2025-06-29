import { Navigate, Outlet } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';

const ProtectedRoute = () => {
  const { session, loading } = useAuthSession();

  // Show a loading state while the session is being checked
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If the session check is complete and there is no user, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If a user is logged in, show the requested page (e.g., the dashboard)
  return <Outlet />;
};

export default ProtectedRoute;