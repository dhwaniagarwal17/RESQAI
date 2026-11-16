import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Props:
 *   allowedRoles  - array of roles that may access this route (optional)
 *                   if omitted, any authenticated user is allowed
 *   redirectTo    - where to send unauthenticated users (default: /login)
 */
export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  // While session is being restored, show nothing (avoids flash of redirect)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-linen">
        <span className="w-5 h-5 border-2 border-carbon/20 border-t-carbon rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Authenticated but wrong role — redirect to their own dashboard
    const roleDashboards = {
      reporter:    '/reporter',
      admin:       '/admin',
      rescue_team: '/rescue',
    }
    return <Navigate to={roleDashboards[role] || '/'} replace />
  }

  return children
}
