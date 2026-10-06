import { Brain, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import UrgencyBadge from './UrgencyBadge';

const AIResultCard = ({ incident }) => {
  const { 
    category, 
    confidence, 
    modelUsed, 
    urgency, 
    humanitarianStatus,
    requestForHelp,
    explanation,
    geminiUsed,
    originalBertweetCategory,
    originalBertweetConfidence
  } = incident;

  return (
    <div className="card space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
        <Brain className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Classification</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Category</p>
          <CategoryBadge category={category} />
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Confidence</p>
          <p className="text-lg font-semibold text-gray-900">
            {(confidence * 100).toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Model Used</p>
          <span className={`badge ${modelUsed === 'BERTweet' ? 'bg-primary-100 text-primary-800' : 'bg-purple-100 text-purple-800'}`}>
            {modelUsed}
          </span>
        </div>

        {urgency && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Urgency</p>
            <UrgencyBadge urgency={urgency} />
          </div>
        )}

        {humanitarianStatus !== undefined && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Humanitarian</p>
            <span className={`badge ${humanitarianStatus ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'}`}>
              {humanitarianStatus ? 'Yes' : 'No'}
            </span>
          </div>
        )}

        {requestForHelp !== undefined && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Request for Help</p>
            <span className={`badge ${requestForHelp ? 'bg-danger-100 text-danger-800' : 'bg-gray-100 text-gray-800'}`}>
              {requestForHelp ? 'Yes' : 'No'}
            </span>
          </div>
        )}
      </div>

      {geminiUsed && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-800 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Additional contextual analysis performed by Gemini
          </p>
        </div>
      )}

      {explanation && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-1 font-medium">Explanation</p>
          <p className="text-sm text-gray-800">{explanation}</p>
        </div>
      )}

      {geminiUsed && originalBertweetCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-800 font-medium mb-1">Original BERTweet Prediction</p>
          <div className="flex items-center gap-3">
            <CategoryBadge category={originalBertweetCategory} />
            <span className="text-blue-900">
              Confidence: {(originalBertweetConfidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <CheckCircle className="w-4 h-4 inline mr-1" />
          AI-generated classifications assist responders. Critical decisions require human verification.
        </p>
      </div>
    </div>
  );
};

export default AIResultCard;
