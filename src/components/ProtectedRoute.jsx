import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, isAdmin as checkIsAdmin } from '../utils/SessionManager.js';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !checkIsAdmin()) {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}