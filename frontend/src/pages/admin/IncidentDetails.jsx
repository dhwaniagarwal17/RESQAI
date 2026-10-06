import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Save } from 'lucide-react';
import { adminAPI, incidentAPI } from '../../services/api';
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
  const [rescueTeams, setRescueTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [incidentRes, teamsRes] = await Promise.all([
        incidentAPI.getById(id),
        adminAPI.getRescueTeams()
      ]);
      
      setIncident(incidentRes.data.data.incident);
      setRescueTeams(teamsRes.data.data.rescueTeams);
      
      if (incidentRes.data.data.incident.assignedRescueTeam) {
        setSelectedTeam(incidentRes.data.data.incident.assignedRescueTeam._id);
      }
    } catch (err) {
      setError('Failed to load incident details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTeam) {
      setError('Please select a rescue team');
      return;
    }

    setAssignLoading(true);
    setError('');

    try {
      await adminAPI.assignIncident(id, selectedTeam);
      await loadData(); // Reload to show updated assignment
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign rescue team');
    } finally {
      setAssignLoading(false);
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
          <button onClick={() => navigate('/admin/incidents')} className="btn btn-secondary mt-4">
            Back to Incidents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/admin/incidents')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Incidents
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
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Message</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{incident.message}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <p>Reported by: <span className="font-medium text-gray-900">{incident.reporter?.name}</span></p>
                <p className="mt-1">
                  Email: <span className="font-medium text-gray-900">{incident.reporter?.email}</span>
                </p>
                {incident.reporter?.phone && (
                  <p className="mt-1">
                    Phone: <span className="font-medium text-gray-900">{incident.reporter.phone}</span>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assign Rescue Team */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Rescue Team</h2>
              </div>

              {incident.assignedRescueTeam ? (
                <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                  <p className="text-sm font-medium text-success-900 mb-1">
                    Currently Assigned
                  </p>
                  <p className="text-sm text-success-800">
                    {incident.assignedRescueTeam.name}
                  </p>
                  {incident.assignedRescueTeam.phone && (
                    <p className="text-xs text-success-700 mt-1">
                      {incident.assignedRescueTeam.phone}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm text-warning-800">
                    No rescue team assigned yet
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {incident.assignedRescueTeam ? 'Reassign to' : 'Assign to'}
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="input mb-3"
                >
                  <option value="">Select rescue team</option>
                  {rescueTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} {team.teamId ? `(${team.teamId})` : ''}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssign}
                  disabled={assignLoading || !selectedTeam}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  {assignLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {incident.assignedRescueTeam ? 'Reassign' : 'Assign'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`font-medium ${
                    incident.priority === 'critical' ? 'text-danger-600' :
                    incident.priority === 'high' ? 'text-warning-600' :
                    'text-gray-900'
                  }`}>
                    {incident.priority?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium text-gray-900">
                    {(incident.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium text-gray-900">
                    {incident.modelUsed}
                  </span>
                </div>
                {incident.humanitarianStatus !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humanitarian:</span>
                    <span className={`font-medium ${incident.humanitarianStatus ? 'text-success-600' : 'text-gray-600'}`}>
                      {incident.humanitarianStatus ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
