import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-linen font-sans flex flex-col items-center justify-center px-6 py-16">
      {/* Top right login button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 bg-carbon text-linen rounded hover:bg-carbon/90 transition-colors text-sm font-medium"
        >
          <LogIn size={16} />
          Login
        </button>
      </div>

      {/* Attribution */}
      <p className="text-xs tracking-widest uppercase text-carbon/30 mb-12 text-center">
        Team Apex &nbsp;·&nbsp; Thapar Institute of Engineering &amp; Technology
      </p>

      {/* Hero */}
      <div className="text-center max-w-2xl mb-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-carbon leading-tight tracking-tight">
          When every second
          <br />
          <span className="text-coral">matters.</span>
        </h1>
      </div>

      <p className="text-center text-carbon/50 max-w-md text-base leading-relaxed mb-8">
        RESQAI routes disaster-related messages through a hybrid AI pipeline — classifying urgency, category, and location so responders can act faster.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white rounded-lg hover:bg-coral/90 transition-colors text-base font-semibold shadow-lg hover:shadow-xl"
      >
        Get Started
        <ArrowRight size={18} strokeWidth={2} />
      </button>

      {/* Features */}
      <div className="mt-16 grid sm:grid-cols-3 gap-8 w-full max-w-3xl">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-coral/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-coral"></div>
          </div>
          <h3 className="font-semibold text-carbon text-sm mb-1">AI-Powered Classification</h3>
          <p className="text-xs text-carbon/50 leading-relaxed">
            Hybrid BERTweet + Gemini model automatically categorizes incidents by urgency and type
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-sage"></div>
          </div>
          <h3 className="font-semibold text-carbon text-sm mb-1">Real-Time Coordination</h3>
          <p className="text-xs text-carbon/50 leading-relaxed">
            Instant incident routing to rescue teams with live status updates and tracking
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-amber"></div>
          </div>
          <h3 className="font-semibold text-carbon text-sm mb-1">Emergency SOS</h3>
          <p className="text-xs text-carbon/50 leading-relaxed">
            One-tap emergency alerts with location sharing for critical situations
          </p>
        </div>
      </div>
    </div>
  )
}
