import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { rescueAPI } from '../../services/api';
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
  const [updateLoading, setUpdateLoading] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadIncident();
  }, [id]);

  const loadIncident = async () => {
    try {
      const response = await rescueAPI.getIncidentById(id);
      setIncident(response.data.data.incident);
    } catch (err) {
      setError('Failed to load incident details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdateLoading(true);
    setError('');

    try {
      await rescueAPI.updateStatus(id, newStatus, notes);
      setNotes('');
      await loadIncident();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdateLoading(false);
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

  if (error && !incident) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error} />
          <button onClick={() => navigate('/rescue')} className="btn btn-secondary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const allowedStatuses = {
    assigned: ['accepted'],
    accepted: ['en_route'],
    en_route: ['on_site'],
    on_site: ['resolved']
  };

  const nextStatuses = allowedStatuses[incident.status] || [];

  const statusActions = {
    accepted: { label: 'Accept Incident', color: 'btn-primary' },
    en_route: { label: 'Mark En Route', color: 'btn-primary' },
    on_site: { label: 'Mark On Site', color: 'btn-primary' },
    resolved: { label: 'Mark Resolved', color: 'btn-primary bg-success-600 hover:bg-success-700' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/rescue')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Incident Details</h1>
              <StatusBadge status={incident.status} />
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError('')} />}

            {/* Message */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Emergency Message</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{incident.message}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <p>Reported by: <span className="font-medium text-gray-900">{incident.reporter?.name}</span></p>
                {incident.reporter?.phone && (
                  <p className="mt-1">
                    Contact: <span className="font-medium text-gray-900">{incident.reporter.phone}</span>
                  </p>
                )}
                <p className="mt-1">
                  Submitted: <span className="font-medium text-gray-900">
                    {new Date(incident.createdAt).toLocaleString()}
                  </span>
                </p>
              </div>
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

          {/* Sidebar - Status Update */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
              </div>

              {incident.status === 'resolved' ? (
                <div className="p-4 bg-success-50 border border-success-200 rounded-lg text-center">
                  <CheckCircle className="w-12 h-12 text-success-600 mx-auto mb-2" />
                  <p className="text-success-900 font-medium">Incident Resolved</p>
                  <p className="text-sm text-success-700 mt-1">
                    This incident has been successfully resolved
                  </p>
                </div>
              ) : nextStatuses.length > 0 ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input h-24 resize-none"
                      placeholder="Add any notes about the status update..."
                    />
                  </div>

                  <div className="space-y-2">
                    {nextStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        disabled={updateLoading}
                        className={`btn ${statusActions[status].color} w-full`}
                      >
                        {updateLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          statusActions[status].label
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">
                    No status updates available
                  </p>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                {incident.urgency && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency:</span>
                    <span className={`font-medium ${
                      incident.urgency === 'HIGH' ? 'text-danger-600' :
                      incident.urgency === 'MEDIUM' ? 'text-warning-600' :
                      'text-blue-600'
                    }`}>
                      {incident.urgency}
                    </span>
                  </div>
                )}
                {incident.requestForHelp !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Request for Help:</span>
                    <span className={`font-medium ${incident.requestForHelp ? 'text-danger-600' : 'text-gray-600'}`}>
                      {incident.requestForHelp ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Model:</span>
                  <span className="font-medium text-gray-900">
                    {incident.modelUsed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium text-gray-900">
                    {(incident.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
