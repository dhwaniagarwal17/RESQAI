import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Activity } from 'lucide-react'
import { getIncidentById, updateIncidentStatus } from '../../data/store'
import { SeverityBadge, StatusBadge } from '../../components/ui/Badge'

const DEMO_INCIDENT_ID = 'INC-001'

const STATUS_FLOW = [
  { status: 'assigned',  label: 'Assigned',  desc: 'Assignment received, awaiting acceptance.' },
  { status: 'accepted',  label: 'Accepted',  desc: 'Assignment accepted by the team.' },
  { status: 'en_route',  label: 'En Route',  desc: 'Team is on the way to the incident site.' },
  { status: 'on_site',   label: 'On Site',   desc: 'Team has arrived at the incident site.' },
  { status: 'resolved',  label: 'Resolved',  desc: 'Incident resolved and handed off.' },
]

export default function StatusUpdate() {
  const navigate = useNavigate()
  const incident = getIncidentById(DEMO_INCIDENT_ID)

  if (!incident) {
    return (
      <div className="p-8 text-center">
        <p className="text-carbon/40 text-sm">No active assignment.</p>
      </div>
    )
  }

  const currentIdx = STATUS_FLOW.findIndex((s) => s.status === incident.status)
  const nextStep   = STATUS_FLOW[currentIdx + 1]

  function handleAdvance() {
    if (!nextStep) return
    updateIncidentStatus(
      DEMO_INCIDENT_ID,
      nextStep.status,
      `Status updated to ${nextStep.label} by rescue team`,
      'rescue-team-alpha-1'
    )
    navigate('/rescue')
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-carbon/50 hover:text-carbon transition-colors"
      >
        <ArrowLeft size={12} /> Back to Assignment
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded bg-carbon flex items-center justify-center">
          <Activity size={16} className="text-white" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-carbon">Status Update</h1>
          <p className="text-xs text-carbon/40">{incident.id} · {incident.description}</p>
        </div>
      </div>

      {/* Current status */}
      <div className="border border-carbon/12 rounded bg-white p-4">
        <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-2">Current Status</p>
        <div className="flex items-center gap-2">
          <StatusBadge status={incident.status} />
          <SeverityBadge severity={incident.verifiedSeverity} />
        </div>
        <p className="text-xs text-carbon/50 mt-2">
          {STATUS_FLOW.find((s) => s.status === incident.status)?.desc}
        </p>
      </div>

      {/* Flow steps */}
      <div className="space-y-2">
        {STATUS_FLOW.map((step, idx) => {
          const isDone    = idx < currentIdx
          const isCurrent = idx === currentIdx
          const isNext    = idx === currentIdx + 1
          return (
            <div
              key={step.status}
              className={`border rounded p-3 flex items-start gap-3 transition-colors ${
                isCurrent ? 'border-carbon bg-carbon/5' :
                isDone    ? 'border-carbon/10 opacity-60' :
                isNext    ? 'border-sage/30 bg-sage/5 cursor-pointer' :
                'border-carbon/8 opacity-30'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDone    ? 'border-carbon bg-carbon' :
                isCurrent ? 'border-carbon bg-carbon' :
                isNext    ? 'border-sage/60 bg-transparent' :
                'border-carbon/15 bg-transparent'
              }`}>
                {isDone && <CheckCircle size={10} className="text-white" strokeWidth={3} />}
                {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className={`text-xs font-semibold ${isCurrent ? 'text-carbon' : isDone ? 'text-carbon/60' : isNext ? 'text-sage' : 'text-carbon/25'}`}>
                  {step.label}
                </p>
                <p className={`text-2xs mt-0.5 ${isCurrent || isNext ? 'text-carbon/50' : 'text-carbon/25'}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action */}
      {nextStep ? (
        <button
          onClick={handleAdvance}
          className="w-full bg-carbon text-white font-semibold text-sm py-4 rounded flex items-center justify-between px-5 hover:bg-carbon/90 transition-colors"
        >
          <span>Mark as {nextStep.label}</span>
          <CheckCircle size={16} strokeWidth={2} />
        </button>
      ) : (
        <div className="border border-sage/30 rounded p-4 text-center">
          <CheckCircle size={24} className="text-sage mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sm font-medium text-carbon">Incident Resolved</p>
          <p className="text-xs text-carbon/50 mt-1">This incident has been fully resolved.</p>
        </div>
      )}
    </div>
  )
}
