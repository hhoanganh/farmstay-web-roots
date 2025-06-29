// ABOUTME: This component protects routes that require authentication.
// ABOUTME: It redirects unauthenticated users to the login page.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const ProtectedRoute = () => {
  const { session } = useAuth();

  // If authenticated, render the child route (e.g., Dashboard).
  // Otherwise, redirect to the login page.
  // The AuthProvider handles the initial loading state, so we don't need a loading check here.
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;