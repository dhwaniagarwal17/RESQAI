import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { incidentAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import ErrorMessage from '../../components/ErrorMessage';
import AIResultCard from '../../components/AIResultCard';
import LocationCard from '../../components/LocationCard';

const SubmitIncident = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    message: '',
    location: {
      latitude: '',
      longitude: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
        },
        (error) => {
          setError('Failed to get location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        message: formData.message,
        location: {}
      };

      // Add location only if provided
      if (formData.location.latitude) {
        payload.location.latitude = parseFloat(formData.location.latitude);
      }
      if (formData.location.longitude) {
        payload.location.longitude = parseFloat(formData.location.longitude);
      }
      if (formData.location.address) {
        payload.location.address = formData.location.address;
      }

      const response = await incidentAPI.create(payload);
      setResult(response.data.data.incident);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit incident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-success-50 border border-success-200 rounded-lg p-6 mb-8 flex items-start">
            <CheckCircle className="w-6 h-6 text-success-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-success-900 mb-1">
                Incident Reported Successfully
              </h2>
              <p className="text-success-800">
                Your report has been analyzed and submitted. Authorities will respond based on priority.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <AIResultCard incident={result} />
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Message</h3>
              <p className="text-gray-700">{result.message}</p>
            </div>

            <LocationCard location={result.location} />

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/reporter')}
                className="btn btn-primary flex-1"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setFormData({
                    message: '',
                    location: { latitude: '', longitude: '', address: '' }
                  });
                }}
                className="btn btn-secondary flex-1"
              >
                Report Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report an Incident
          </h1>
          <p className="text-gray-600">
            Describe the emergency situation. Our AI will analyze and classify your report.
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Incident Description
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input h-40 resize-none"
                placeholder="Describe the emergency situation in detail..."
                required
                minLength={10}
              />
              <p className="text-xs text-gray-600 mt-1">
                Minimum 10 characters. Be clear and specific.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Location (Optional)
              </h2>
              <button
                type="button"
                onClick={handleGetLocation}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <MapPin className="w-4 h-4" />
                Use My Location
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location.latitude}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, latitude: e.target.value }
                  })}
                  className="input"
                  placeholder="30.3398"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location.longitude}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, longitude: e.target.value }
                  })}
                  className="input"
                  placeholder="76.3869"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address or Landmark
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
                className="input"
                placeholder="Main Street, City Name"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing incident...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze & Report
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Your report will be analyzed by AI and forwarded to relevant authorities
          </p>
        </form>
      </div>
    </div>
  );
};

export default SubmitIncident;
