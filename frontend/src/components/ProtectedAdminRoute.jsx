import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context';

/**
 * Route protection wrapper for administrative pages.
 * Ensures that only authenticated users with the role 'admin' can view child routes.
 *
 * If not authenticated: redirects to /login (with return URL saved in state).
 * If authenticated but not admin: redirects to / (Home) to prevent unauthorized access.
 */
export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-body text-gray-400 text-sm">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated visitors to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role?.toLowerCase() !== 'admin') {
    // Redirect regular authenticated users back to home
    return <Navigate to="/" replace />;
  }

  return children;
}
