import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#b70a10]/30 border-t-[#b70a10] rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-[#57534E]">Loading context...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has not completed profile, redirect them to /complete-profile
  if (!user?.profile_complete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // If user has completed profile, prevent them from going back to /complete-profile
  if (user?.profile_complete && location.pathname === '/complete-profile') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
