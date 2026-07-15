import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-muted-foreground">Loading context...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has not completed profile, redirect them to /complete-profile
  // But allow dashboard profile pages so user can edit from there too
  const profileAllowedPaths = ['/complete-profile', '/dashboard/user/profile', '/dashboard/user/profile/edit'];
  if (!user?.profile_complete && !profileAllowedPaths.includes(location.pathname)) {
    return <Navigate to="/complete-profile" replace />;
  }

  // If user has completed profile, prevent them from going back to /complete-profile
  if (user?.profile_complete && location.pathname === '/complete-profile') {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
