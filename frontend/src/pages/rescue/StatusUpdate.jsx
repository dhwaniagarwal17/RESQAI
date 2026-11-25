import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Activity, Loader } from 'lucide-react'
import { getIncidentDetails, updateIncidentStatus } from '../../services/rescueService'
import { SeverityBadge, StatusBadge } from '../../components/ui/Badge'

const STATUS_FLOW = [
  { status: 'pending',   label: 'Pending',    desc: 'Incident pending assignment.' },
  { status: 'assigned',  label: 'Assigned',   desc: 'Assignment received, awaiting acceptance.' },
  { status: 'accepted',  label: 'Accepted',   desc: 'Assignment accepted by the team.' },
  { status: 'en_route',  label: 'Responding', desc: 'Team is responding to the incident location.' },
  { status: 'on_site',   label: 'On Site',    desc: 'Team has arrived at the incident site.' },
  { status: 'resolved',  label: 'Resolved',   desc: 'Incident resolved and operation completed.' },
]

export default function StatusUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) {
        // No ID provided, fetch from assigned incidents
        try {
          const { getAssignedIncidents } = await import('../../services/rescueService')
          const incidents = await getAssignedIncidents()
          if (incidents.length > 0) {
            setIncident(incidents[0])
          } else {
            setError('No active assignment found')
          }
        } catch (err) {
          console.error('Failed to fetch incidents:', err)
          setError('Failed to load assignment')
        } finally {
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        const data = await getIncidentDetails(id)
        setIncident(data)
      } catch (err) {
        console.error('Failed to fetch incident:', err)
        setError('Failed to load incident details')
      } finally {
        setLoading(false)
      }
    }

    fetchIncident()
  }, [id])

  async function handleAdvance() {
    if (!incident) return

    const currentIdx = STATUS_FLOW.findIndex((s) => s.status === incident.status)
    
    // If incident is in pending status, it needs to be assigned first
    if (incident.status === 'pending') {
      setError('This incident needs to be formally assigned first. Please contact operations.')
      return
    }

    const nextStep   = STATUS_FLOW[currentIdx + 1]

    if (!nextStep) return

    // Skip pending status if it appears in the flow
    const nextStatus = nextStep.status === 'pending' ? STATUS_FLOW[currentIdx + 2]?.status : nextStep.status

    if (!nextStatus) return

    setUpdating(true)
    setError(null)

    try {
      const updatedIncident = await updateIncidentStatus(
        incident._id,
        nextStatus,
        `Status updated to ${nextStep.label} by rescue team`
      )

      // Update local state with response
      setIncident(updatedIncident)

      // If resolved, go back to dashboard
      if (nextStatus === 'resolved') {
        setTimeout(() => navigate('/rescue'), 1000)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      let errorMsg = 'Failed to update status. Please try again.'
      
      // Try to extract more specific error from response
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err.message) {
        errorMsg = err.message
      }
      
      setError(errorMsg)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader size={24} className="animate-spin text-carbon/40 mx-auto mb-2" />
        <p className="text-carbon/40 text-sm">Loading...</p>
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="p-8 text-center">
        <p className="text-coral text-sm">{error || 'No active assignment.'}</p>
        <button
          onClick={() => navigate('/rescue')}
          className="mt-4 text-xs text-carbon/50 hover:text-carbon underline"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const currentIdx = STATUS_FLOW.findIndex((s) => s.status === incident.status)
  const nextStep   = STATUS_FLOW[currentIdx + 1]

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
          <p className="text-xs text-carbon/40">{incident.message || 'Emergency Incident'}</p>
        </div>
      </div>

      {error && (
        <div className="bg-coral/8 border border-coral/20 rounded p-3 text-xs text-coral leading-relaxed">
          <p className="font-semibold mb-1">Error:</p>
          <p>{error}</p>
          <p className="text-2xs mt-2 text-coral/70">
            Current status: {incident.status} | Attempting: {nextStep?.status || 'none'}
          </p>
        </div>
      )}

      {/* Current status */}
      <div className="border border-carbon/12 rounded bg-white p-4">
        <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-2">Current Status</p>
        <div className="flex items-center gap-2">
          <StatusBadge status={incident.status} />
          <SeverityBadge severity={incident.urgency || incident.priority || 'medium'} />
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
                isNext    ? 'border-sage/30 bg-sage/5' :
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
          disabled={updating}
          className="w-full bg-carbon text-white font-semibold text-sm py-4 rounded flex items-center justify-between px-5 hover:bg-carbon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{updating ? 'Updating...' : `Mark as ${nextStep.label}`}</span>
          {updating ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <CheckCircle size={16} strokeWidth={2} />
          )}
        </button>
      ) : (
        <div className="border border-sage/30 rounded p-4 text-center">
          <CheckCircle size={24} className="text-sage mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sm font-medium text-carbon">Operation Completed</p>
          <p className="text-xs text-carbon/50 mt-1">This incident has been successfully resolved.</p>
        </div>
      )}
    </div>
  )
}
