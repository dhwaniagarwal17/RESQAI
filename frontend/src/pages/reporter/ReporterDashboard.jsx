import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { incidentAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import IncidentCard from '../../components/IncidentCard';
import EmptyState from '../../components/EmptyState';

const ReporterDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await incidentAPI.getMy();
      setIncidents(response.data.data.incidents);
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: incidents.length,
    active: incidents.filter(i => !['resolved', 'cancelled'].includes(i.status)).length,
    resolved: incidents.filter(i => i.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600">
            Report incidents and track their status
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link
            to="/reporter/submit"
            className="btn btn-primary flex items-center gap-2 inline-flex"
          >
            <Plus className="w-5 h-5" />
            Report New Incident
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-warning-600">{stats.active}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-warning-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-success-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-success-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Incidents List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Incidents</h2>
          
          {loading ? (
            <LoadingSpinner text="Loading incidents..." />
          ) : incidents.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No incidents reported yet"
              message="Start by reporting your first incident"
              action={
                <Link to="/reporter/submit" className="btn btn-primary">
                  Report Incident
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  linkTo={`/reporter/incidents/${incident._id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReporterDashboard;
