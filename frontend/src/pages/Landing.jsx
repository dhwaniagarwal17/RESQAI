import { Link } from 'react-router-dom';
import { AlertTriangle, Users, Shield, Activity, ArrowRight, Brain, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-danger-600 rounded-2xl shadow-lg">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            RESQAI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            AI-Assisted Disaster Response System
          </p>
          
          <div className="flex items-center justify-center gap-3 text-lg text-gray-700 mb-12">
            <span className="font-semibold">Detect</span>
            <span>•</span>
            <span className="font-semibold">Understand</span>
            <span>•</span>
            <span className="font-semibold">Respond</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2"
            >
              Report an Incident
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary px-8 py-3 text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How RESQAI Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Disaster Message</h3>
              <p className="text-gray-600 text-sm">
                Citizens report incidents with optional location information
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">BERTweet Classification</h3>
              <p className="text-gray-600 text-sm">
                AI model analyzes and categorizes the incident
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confidence Check</h3>
              <p className="text-gray-600 text-sm">
                Gemini provides contextual analysis when needed
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mx-auto mb-4">
                <Activity className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Human Response</h3>
              <p className="text-gray-600 text-sm">
                Rescue teams take action based on AI-assisted classification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Roles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reporter</h3>
              <p className="text-gray-600">
                Submit disaster messages, provide location information, and track incident status
              </p>
            </div>

            <div className="card text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Administrator</h3>
              <p className="text-gray-600">
                View all incidents, analyze AI classifications, and assign rescue teams
              </p>
            </div>

            <div className="card text-center">
              <Activity className="w-12 h-12 text-danger-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Rescue Team</h3>
              <p className="text-gray-600">
                Receive assignments, update rescue status, and resolve incidents
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-t border-yellow-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            AI-Assisted, Human-Verified
          </h3>
          <p className="text-yellow-800">
            RESQAI uses AI to assist emergency responders. All critical decisions require human verification. 
            The system is designed to support, not replace, human judgment in life-critical situations.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2026 Team APEX - RESQAI. AI-Assisted Disaster Response System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
