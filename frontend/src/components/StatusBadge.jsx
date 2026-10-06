import { STATUS } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    accepted: 'bg-indigo-100 text-indigo-800',
    en_route: 'bg-purple-100 text-purple-800',
    on_site: 'bg-orange-100 text-orange-800',
    resolved: 'bg-success-100 text-success-800',
    cancelled: 'bg-gray-200 text-gray-600'
  };

  return (
    <span className={`badge ${statusColors[status] || statusColors.pending}`}>
      {STATUS[status] || status}
    </span>
  );
};

export default StatusBadge;
