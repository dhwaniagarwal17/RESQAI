import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Reporter Pages
import ReporterDashboard from './pages/reporter/ReporterDashboard';
import SubmitIncident from './pages/reporter/SubmitIncident';
import ReporterIncidentDetails from './pages/reporter/IncidentDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIncidents from './pages/admin/Incidents';
import AdminIncidentDetails from './pages/admin/IncidentDetails';

// Rescue Pages
import RescueDashboard from './pages/rescue/RescueDashboard';
import RescueIncidentDetails from './pages/rescue/IncidentDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Reporter Routes */}
          <Route
            path="/reporter"
            element={
              <RoleRoute allowedRoles={['reporter']}>
                <ReporterDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/reporter/submit"
            element={
              <RoleRoute allowedRoles={['reporter', 'admin']}>
                <SubmitIncident />
              </RoleRoute>
            }
          />
          <Route
            path="/reporter/incidents/:id"
            element={
              <RoleRoute allowedRoles={['reporter']}>
                <ReporterIncidentDetails />
              </RoleRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminIncidents />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/incidents/:id"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminIncidentDetails />
              </RoleRoute>
            }
          />

          {/* Rescue Team Routes */}
          <Route
            path="/rescue"
            element={
              <RoleRoute allowedRoles={['rescue_team']}>
                <RescueDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/rescue/incidents/:id"
            element={
              <RoleRoute allowedRoles={['rescue_team']}>
                <RescueIncidentDetails />
              </RoleRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
