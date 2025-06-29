// ABOUTME: This component protects routes that require authentication.
// ABOUTME: It redirects unauthenticated users to the login page.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, userProfile } = useAuth();
  const location = useLocation();

  // 1. If there's no session, redirect to login.
  // The AuthProvider handles the initial loading state, so we don't need a loading check here.
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. If roles are specified, check if the user has one of the allowed roles.
  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    // User is logged in but doesn't have permission. Redirect to the main dashboard.
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. If the user is authenticated (and has the right role if specified), render the child route.
  return <Outlet />;
};

export default ProtectedRoute;