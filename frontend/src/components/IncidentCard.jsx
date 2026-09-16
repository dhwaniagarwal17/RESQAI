import { Calendar, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import StatusBadge from './StatusBadge';
import UrgencyBadge from './UrgencyBadge';

const IncidentCard = ({ incident, linkTo }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link to={linkTo} className="card hover:shadow-md transition-shadow duration-200 block">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={incident.category} />
            <StatusBadge status={incident.status} />
          </div>
          {incident.urgency && <UrgencyBadge urgency={incident.urgency} />}
        </div>
      </div>

      <p className="text-gray-900 mb-3 line-clamp-2">{incident.message}</p>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {incident.location?.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{incident.location.address}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(incident.createdAt)}</span>
          </div>
        </div>

        {incident.reporter && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{incident.reporter.name}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
        <span className={`badge ${incident.modelUsed === 'BERTweet' ? 'bg-primary-100 text-primary-800' : 'bg-purple-100 text-purple-800'}`}>
          {incident.modelUsed}
        </span>
        <span className="text-gray-600">
          Confidence: {(incident.confidence * 100).toFixed(1)}%
        </span>
      </div>
    </Link>
  );
};

export default IncidentCard;
