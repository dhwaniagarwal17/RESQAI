import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute   from './components/layout/ProtectedRoute'

// Layout shells
import ReporterShell from './components/layout/ReporterShell'
import AdminShell    from './components/layout/AdminShell'
import RescueShell   from './components/layout/RescueShell'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Landing
import LandingPage from './pages/landing/LandingPage'

// Reporter pages
import ReporterDashboard from './pages/reporter/ReporterDashboard'
import MyReports         from './pages/reporter/MyReports'
import ReportDetail      from './pages/reporter/ReportDetail'
import ReportForm        from './pages/reporter/ReportForm'
import SOSPage           from './pages/reporter/SOSPage'

// Admin pages
import AdminOverview       from './pages/admin/AdminOverview'
import IncidentManagement  from './pages/admin/IncidentManagement'
import IncidentDetail      from './pages/admin/IncidentDetail'
import TeamManagement      from './pages/admin/TeamManagement'

// Rescue pages
import RescueDashboard from './pages/rescue/RescueDashboard'
import StatusUpdate    from './pages/rescue/StatusUpdate'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Citizen / Reporter — requires reporter role */}
          <Route
            path="/reporter"
            element={
              <ProtectedRoute allowedRoles={['reporter']}>
                <ReporterShell />
              </ProtectedRoute>
            }
          >
            <Route index            element={<ReporterDashboard />} />
            <Route path="report"    element={<ReportForm />} />
            <Route path="sos"       element={<SOSPage />} />
            <Route path="reports"   element={<MyReports />} />
            <Route path="reports/:id" element={<ReportDetail />} />
          </Route>

          {/* Admin — requires admin role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminShell />
              </ProtectedRoute>
            }
          >
            <Route index                element={<AdminOverview />} />
            <Route path="incidents"     element={<IncidentManagement />} />
            <Route path="incidents/:id" element={<IncidentDetail />} />
            <Route path="teams"         element={<TeamManagement />} />
          </Route>

          {/* Rescue Team — requires rescue_team role */}
          <Route
            path="/rescue"
            element={
              <ProtectedRoute allowedRoles={['rescue_team']}>
                <RescueShell />
              </ProtectedRoute>
            }
          >
            <Route index         element={<RescueDashboard />} />
            <Route path="status" element={<StatusUpdate />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
