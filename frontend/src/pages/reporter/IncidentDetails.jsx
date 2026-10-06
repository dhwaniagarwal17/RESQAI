import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { incidentAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import AIResultCard from '../../components/AIResultCard';
import LocationCard from '../../components/LocationCard';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIncident();
  }, [id]);

  const loadIncident = async () => {
    try {
      const response = await incidentAPI.getById(id);
      setIncident(response.data.data.incident);
    } catch (err) {
      setError('Failed to load incident details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner text="Loading incident..." />
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Incident not found'} />
          <button onClick={() => navigate('/reporter')} className="btn btn-secondary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/reporter')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Incident Details</h1>
            <StatusBadge status={incident.status} />
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(incident.createdAt).toLocaleString()}</span>
            </div>
            {incident.assignedRescueTeam && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Assigned to: {incident.assignedRescueTeam.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Message */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Message</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{incident.message}</p>
          </div>

          {/* AI Classification */}
          <AIResultCard incident={incident} />

          {/* Location */}
          <LocationCard location={incident.location} />

          {/* Status History */}
          {incident.statusHistory && incident.statusHistory.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
              <div className="space-y-3">
                {incident.statusHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={history.status} />
                        <span className="text-sm text-gray-600">
                          {new Date(history.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-700 mt-1">{history.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
