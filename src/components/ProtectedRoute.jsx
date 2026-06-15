import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // Get user from Auth context
  const location = useLocation();
  const data = user// Check if user is logged in and their role is allowed
  if (!data) {
    return <Navigate to="/" replace />; // Redirect to login if user is not authenticated
  } else if (!allowedRoles.includes(data.role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect if user role is not allowed
  }

  if (data.role !== "super-admin") {
    const path = location.pathname;
    let requiredPerm = null;
    
    if (path.startsWith('/dashboard')) requiredPerm = '/dashboard';
    else if (path.startsWith('/myshop')) requiredPerm = '/myshop';
    else if (path.startsWith('/audit') || path.startsWith('/add-audit') || path.startsWith('/perform-audit') || path.startsWith('/tea') || path.startsWith('/coffee') || path.startsWith('/livesnacks') || path.startsWith('/bunzo') || path.startsWith('/bakshanm') || path.startsWith('/insideshop') || path.startsWith('/recording') || path.startsWith('/dressing') || path.startsWith('/outsideshop') || path.startsWith('/kitchen') || path.startsWith('/wallpanting') || path.startsWith('/Stock') || path.startsWith('/employee/') || path.startsWith('/branding')) requiredPerm = '/audit';
    else if (path.startsWith('/attendance')) requiredPerm = '/attendance';
    else if (path.startsWith('/leave-request')) requiredPerm = '/leave-request';
    else if (path.startsWith('/report')) requiredPerm = '/reports';
    else if (path.startsWith('/routes') || path.startsWith('/set-routes')) requiredPerm = '/routes';
    else if (path.startsWith('/schedule-audit')) requiredPerm = '/schedule-audit';

    if (requiredPerm && !(data.permissions && data.permissions.includes(requiredPerm))) {
        return <Navigate to="/profile" replace />;
    }
  }

  // If authenticated and role is allowed, render the child components (via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;