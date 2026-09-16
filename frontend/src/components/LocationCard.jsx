import { MapPin, ExternalLink } from 'lucide-react';

const LocationCard = ({ location }) => {
  if (!location || (!location.latitude && !location.longitude && !location.address)) {
    return null;
  }

  const { latitude, longitude, address } = location;

  const openInMaps = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 mb-4">
        <MapPin className="w-5 h-5 text-danger-600" />
        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
      </div>

      <div className="space-y-3">
        {address && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="text-sm text-gray-900">{address}</p>
          </div>
        )}

        {(latitude && longitude) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Latitude</p>
              <p className="text-sm text-gray-900 font-mono">{latitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Longitude</p>
              <p className="text-sm text-gray-900 font-mono">{longitude.toFixed(6)}</p>
            </div>
          </div>
        )}

        {(latitude && longitude) && (
          <button
            onClick={openInMaps}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
