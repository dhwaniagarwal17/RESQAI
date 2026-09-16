import { AlertCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon = AlertCircle, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Icon className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-gray-600 mb-6 max-w-md">{message}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
