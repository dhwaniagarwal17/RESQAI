import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Radio, ArrowRight, Clock, MapPin } from 'lucide-react'
import { useStore } from '../../hooks/useStore'
import { useAuth } from '../../context/AuthContext'
import { getMyIncidents as apiGetMyIncidents } from '../../services/incidentService'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'
import MapPlaceholder from '../../components/ui/MapPlaceholder'
import { formatRelativeTime } from '../../data/store'

export default function ReporterDashboard() {
  const navigate = useNavigate()
  const { incidents: storeIncidents } = useStore()
  const { isAuthenticated } = useAuth()

  const [recentIncidents, setRecentIncidents] = useState(storeIncidents.slice(0, 3))

  useEffect(() => {
    async function loadRecent() {
      if (!isAuthenticated) {
        setRecentIncidents(storeIncidents.slice(0, 3))
        return
      }
      try {
        const data = await apiGetMyIncidents()
        setRecentIncidents(data.slice(0, 3).map((inc) => ({
          id: inc._id,
          description: inc.message || inc.description,
          category: inc.category,
          verifiedSeverity: inc.priority,
          status: inc.status === 'pending' ? 'submitted' : inc.status,
          createdAt: inc.createdAt,
          locationText: inc.location?.address || '—',
        })))
      } catch {
        setRecentIncidents(storeIncidents.slice(0, 3))
      }
    }
    loadRecent()
  }, [isAuthenticated, storeIncidents])

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">

      {/* Hero section */}
      <section>
        <p className="text-2xs font-semibold tracking-widest uppercase text-coral mb-3">Emergency Reporting</p>
        <h1 className="text-4xl font-bold text-carbon leading-tight mb-3">
          When every second<br />matters, act now.
        </h1>
        <p className="text-sm text-carbon/50 leading-relaxed max-w-sm">
          Describe what you see and RESQAI will route your report to the right responders immediately. You can track the status of your submission below.
        </p>
      </section>

      {/* Action cards */}
      <section className="grid sm:grid-cols-2 gap-4">
        {/* Report */}
        <div className="border border-carbon/12 rounded bg-white p-5">
          <p className="text-2xs font-semibold tracking-widest uppercase text-carbon/40 mb-1">Standard Report</p>
          <h2 className="font-semibold text-carbon mb-1">Report an Emergency</h2>
          <p className="text-xs text-carbon/50 leading-relaxed mb-4">
            Describe the situation — what happened, where, and how many people are affected.
          </p>
          <button
            onClick={() => navigate('/reporter/report')}
            className="inline-flex items-center justify-between gap-2 w-full bg-carbon text-white text-sm font-medium px-4 py-2.5 rounded hover:bg-carbon/90 transition-colors"
          >
            <span>Start Report</span>
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>

        {/* SOS */}
        <div className="border border-coral/20 rounded bg-white p-5">
          <p className="text-2xs font-semibold tracking-widest uppercase text-coral mb-1 flex items-center gap-1">
            <Radio size={10} strokeWidth={2} />
            Immediate Danger
          </p>
          <h2 className="font-semibold text-carbon mb-1">SOS Signal</h2>
          <p className="text-xs text-carbon/50 leading-relaxed mb-4">
            Use only if you or someone nearby faces immediate life-threatening danger.
          </p>
          <button
            onClick={() => navigate('/reporter/sos')}
            className="inline-flex items-center justify-between gap-2 w-full bg-coral text-white text-sm font-medium px-4 py-2.5 rounded hover:bg-coral/90 transition-colors"
          >
            <span>Send SOS</span>
            <Radio size={14} strokeWidth={2} />
          </button>
          <p className="text-2xs text-carbon/30 mt-2 text-center">Demo only — no real signal is transmitted.</p>
        </div>
      </section>

      {/* Location preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-carbon text-sm">Your Location</h2>
          <span className="text-xs text-carbon/40 flex items-center gap-1">
            <MapPin size={11} />
            Simulated · Chandigarh, India
          </span>
        </div>
        <MapPlaceholder
          height="h-40"
          label="SIMULATED — MAP INTEGRATION PENDING"
          locationLabel="Chandigarh, India"
        />
        <p className="text-2xs text-carbon/30 mt-1.5">
          ✦ Location will be shared with your report automatically when GPS is enabled.
        </p>
      </section>

      {/* Recent reports */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-carbon text-sm">My Reports</h2>
          <button
            onClick={() => navigate('/reporter/reports')}
            className="text-xs text-carbon/50 hover:text-carbon flex items-center gap-1 transition-colors"
          >
            {storeIncidents.length} submitted <ArrowRight size={11} />
          </button>
        </div>

        {recentIncidents.length === 0 ? (
          <div className="border border-carbon/10 rounded p-6 text-center">
            <p className="text-sm text-carbon/40">No reports yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentIncidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => navigate(`/reporter/reports/${inc.id}`)}
                className="w-full text-left border border-carbon/10 rounded p-3.5 hover:bg-white hover:border-carbon/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-2xs font-mono text-carbon/35 mb-0.5">{inc.id}</p>
                    <p className="text-sm font-medium text-carbon truncate">{inc.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-2xs text-carbon/40">
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} />
                        {formatRelativeTime(inc.createdAt)}
                      </span>
                      <span>·</span>
                      <span>{inc.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <SeverityBadge severity={inc.verifiedSeverity} />
                    <StatusBadge status={inc.status} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-carbon/10 pt-8">
        <h2 className="font-semibold text-carbon text-sm mb-4">How RESQAI Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              n: '01',
              icon: '📝',
              title: 'Describe the situation',
              desc: 'Tell us what you see — location, number of people affected, and the nature of the emergency.',
            },
            {
              n: '02',
              icon: '🤖',
              title: 'AI routes your report',
              desc: 'RESQAI classifies your message by category and urgency within seconds using BERTweet and Gemini.',
            },
            {
              n: '03',
              icon: '🚨',
              title: 'Responders dispatched',
              desc: 'An administrator reviews the result and assigns the nearest available rescue team.',
            },
          ].map((step) => (
            <div key={step.n}>
              <p className="text-2xs font-mono text-carbon/30 mb-1">{step.n}</p>
              <p className="text-lg mb-1">{step.icon}</p>
              <p className="text-sm font-medium text-carbon mb-1">{step.title}</p>
              <p className="text-xs text-carbon/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
