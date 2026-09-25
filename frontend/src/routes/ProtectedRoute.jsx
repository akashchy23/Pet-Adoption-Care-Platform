import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_REDIRECT_PATHS } from '../utils/constants';
import { Skeleton } from '../components/common/Skeleton';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="space-y-4 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and does not match
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const fallbackPath = ROLE_REDIRECT_PATHS[role] || '/';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
