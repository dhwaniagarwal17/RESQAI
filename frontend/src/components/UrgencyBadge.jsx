import { AlertCircle } from 'lucide-react';
import { URGENCY } from '../utils/constants';

const UrgencyBadge = ({ urgency }) => {
  const urgencyConfig = {
    HIGH: {
      bg: 'bg-danger-100',
      text: 'text-danger-800',
      border: 'border-danger-300',
      icon: 'text-danger-600'
    },
    MEDIUM: {
      bg: 'bg-warning-100',
      text: 'text-warning-800',
      border: 'border-warning-300',
      icon: 'text-warning-600'
    },
    LOW: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: 'text-blue-600'
    }
  };

  const config = urgencyConfig[urgency] || urgencyConfig.LOW;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <AlertCircle className={`w-3 h-3 ${config.icon}`} />
      {URGENCY[urgency] || urgency}
    </span>
  );
};

export default UrgencyBadge;
