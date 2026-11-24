import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LogIn } from 'lucide-react'

const portals = [
  {
    role: 'CITIZEN',
    title: 'Report an Emergency',
    description: 'Submit incident reports, send SOS, and track the status of your case in real time.',
    cta: 'Open Citizen Portal',
    path: '/reporter',
  },
  {
    role: 'ADMINISTRATOR',
    title: 'Operations Dashboard',
    description: 'Monitor classified incidents, review AI analysis, and coordinate rescue team deployments.',
    cta: 'Open Admin Console',
    path: '/admin',
  },
  {
    role: 'RESCUE TEAM',
    title: 'Field Assignment',
    description: 'View your assigned incident, navigate to the site, and update your response status.',
    cta: 'Open Team Dashboard',
    path: '/rescue',
  },
]

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

      <p className="text-center text-carbon/50 max-w-sm text-sm leading-relaxed mb-12">
        RESQAI routes disaster-related messages through a hybrid AI pipeline — classifying urgency, category, and location so responders can act faster.
      </p>

      {/* Portal cards */}
      <div className="grid sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {portals.map((p) => (
          <button
            key={p.role}
            onClick={() => navigate(p.path)}
            className="group text-left border border-carbon/12 rounded bg-linen hover:bg-white hover:border-carbon/20 hover:shadow-sm transition-all duration-200 p-5"
          >
            <p className="text-2xs font-semibold tracking-widest uppercase text-coral mb-3">{p.role}</p>
            <div className="w-8 h-px bg-carbon/20 mb-3" />
            <p className="font-semibold text-carbon text-sm mb-2">{p.title}</p>
            <p className="text-xs text-carbon/50 leading-relaxed mb-4">{p.description}</p>
            <span className="inline-flex items-center gap-1 text-xs text-carbon/50 group-hover:text-carbon transition-colors">
              {p.cta}
              <ArrowRight size={11} strokeWidth={2} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
