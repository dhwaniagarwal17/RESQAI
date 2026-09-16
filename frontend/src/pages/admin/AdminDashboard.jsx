import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor incidents and manage rescue operations
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Overview Stats */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.overview.total}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-gray-400" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-warning-600">{stats.overview.pending}</p>
                  </div>
                  <Clock className="w-12 h-12 text-warning-400" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assigned</p>
                    <p className="text-3xl font-bold text-primary-600">{stats.overview.assigned}</p>
                  </div>
                  <Activity className="w-12 h-12 text-primary-400" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-success-600">{stats.overview.resolved}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-success-400" />
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Incidents by Category
                </h2>
                <div className="space-y-3">
                  {stats.byCategory.slice(0, 5).map((cat) => (
                    <div key={cat._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {cat._id.replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold text-gray-900">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Urgency Distribution
                </h2>
                <div className="space-y-3">
                  {stats.byUrgency.map((urg) => (
                    <div key={urg._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            urg._id === 'HIGH' ? 'text-danger-600' :
                            urg._id === 'MEDIUM' ? 'text-warning-600' :
                            'text-blue-600'
                          }`}
                        />
                        <span className="text-sm text-gray-700">{urg._id}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{urg.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Usage */}
            <div className="card mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                AI Model Usage
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {stats.byModel.map((model) => (
                  <div key={model._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{model._id}</span>
                    <span className="font-semibold text-gray-900">{model.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/incidents" className="btn btn-primary">
              View All Incidents
            </Link>
            <Link
              to="/admin/incidents?status=pending"
              className="btn btn-secondary"
            >
              View Pending ({stats?.overview.pending || 0})
            </Link>
            <Link
              to="/admin/incidents?urgency=HIGH"
              className="btn btn-danger"
            >
              High Urgency
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
