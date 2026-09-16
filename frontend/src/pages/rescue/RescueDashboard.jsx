import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { rescueAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import IncidentCard from '../../components/IncidentCard';
import EmptyState from '../../components/EmptyState';

const RescueDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await rescueAPI.getIncidents({});
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
    active: incidents.filter(i => ['assigned', 'accepted', 'en_route', 'on_site'].includes(i.status)).length,
    highUrgency: incidents.filter(i => i.urgency === 'HIGH' && i.status !== 'resolved').length,
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
            Manage your assigned rescue operations
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Assigned</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Activity className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-primary-600">{stats.active}</p>
              </div>
              <Clock className="w-12 h-12 text-primary-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Urgency</p>
                <p className="text-3xl font-bold text-danger-600">{stats.highUrgency}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-danger-400" />
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

        {/* Incidents */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Incidents</h2>
          
          {loading ? (
            <LoadingSpinner text="Loading incidents..." />
          ) : incidents.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No incidents assigned"
              message="You don't have any incidents assigned to you yet"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  linkTo={`/rescue/incidents/${incident._id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescueDashboard;
