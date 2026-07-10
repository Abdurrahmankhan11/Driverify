import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#b70a10]/30 border-t-[#b70a10] rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-[#57534E]">Verifying permissions...</span>
        </div>
      </div>
    );
  }

  // If not logged in, they shouldn't even be here (ProtectedRoute handles that), 
  // but as a fallback, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not in the allowedRoles list, redirect to their home
  if (user && !allowedRoles.includes(user.role)) {
    // Determine where to send them based on their actual role
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />;
      case 'MIDDLEMAN':
        return <Navigate to="/dashboard/middleman" replace />;
      case 'USER':
      default:
        return <Navigate to="/dashboard/user" replace />;
    }
  }

  return children;
};

export default RoleRoute;
