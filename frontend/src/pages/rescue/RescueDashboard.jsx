import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, Navigation, Phone, ChevronRight } from 'lucide-react'
import { getAssignedIncidents } from '../../services/rescueService'
import { SeverityBadge, StatusBadge, CategoryBadge } from '../../components/ui/Badge'
import MapPlaceholder from '../../components/ui/MapPlaceholder'
import { formatRelativeTime } from '../../data/store'

const STATUS_STEPS = ['assigned', 'accepted', 'en_route', 'on_site', 'resolved']
const STEP_LABELS  = ['Assigned', 'Accepted', 'Responding', 'On Site', 'Resolved']

const EMERGENCY_CONTACTS = [
  { name: 'Operations Centre', number: '0172-XXX-XXXX', type: 'ops' },
  { name: 'Medical Dispatch',  number: '108',           type: 'medical' },
  { name: 'Police Control Room', number: '100',         type: 'police' },
]

export default function RescueDashboard() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignedIncidents = async () => {
      try {
        setLoading(true)
        const data = await getAssignedIncidents()
        
        // Filter out resolved incidents, show only active assignments
        const activeIncidents = data.filter(inc => inc.status !== 'resolved' && inc.status !== 'cancelled')
        setIncidents(activeIncidents)
      } catch (err) {
        console.error('Failed to fetch assigned incidents:', err)
        console.error('Error details:', err.response?.data || err.message)
        
        let errorMsg = 'Failed to load your assignments'
        if (err.response?.data?.message) {
          errorMsg += ': ' + err.response.data.message
        } else if (err.message) {
          errorMsg += ': ' + err.message
        }
        
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedIncidents()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-carbon/40 text-sm">Loading your assignments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-coral text-sm">{error}</p>
      </div>
    )
  }

  if (incidents.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-carbon/40 text-sm">No active assignments found.</p>
        <p className="text-carbon/30 text-xs mt-1">You'll see your assigned incidents here when dispatched.</p>
      </div>
    )
  }

  // Show the most recent/urgent assignment
  const incident = incidents[0]
  const currentStepIdx = STATUS_STEPS.indexOf(incident.status)

  return (
    <div className="p-5 space-y-5">
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: incident + progress */}
        <div className="lg:col-span-3 space-y-4">
          {/* Incident card */}
          <div className="border border-carbon/12 rounded bg-white p-5">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <SeverityBadge severity={incident.urgency || incident.priority || 'medium'} />
              <StatusBadge status={incident.status} />
              <CategoryBadge category={incident.category} />
            </div>

            <h1 className="text-xl font-bold text-carbon mb-1.5">{incident.message || 'Emergency Incident'}</h1>
            <p className="text-sm text-carbon/60 leading-relaxed mb-5">{incident.message || 'Emergency response required'}</p>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-carbon/8 rounded p-3">
                <p className="text-2xs text-carbon/35 uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-sm font-medium text-carbon flex items-center gap-1">
                  <MapPin size={12} className="text-carbon/40" />
                  {incident.location?.address || 'Location pending'}
                </p>
              </div>
              <div className="border border-carbon/8 rounded p-3">
                <p className="text-2xs text-carbon/35 uppercase tracking-wider mb-0.5">Reporter</p>
                <p className="text-sm font-medium text-carbon">
                  {incident.reporter?.name || 'Anonymous'}
                </p>
              </div>
              <div className="border border-carbon/8 rounded p-3">
                <p className="text-2xs text-carbon/35 uppercase tracking-wider mb-0.5">Reported</p>
                <p className="text-sm font-medium text-carbon flex items-center gap-1">
                  <Clock size={12} className="text-carbon/40" />
                  {formatRelativeTime(incident.createdAt)}
                </p>
              </div>
              <div className="border border-carbon/8 rounded p-3">
                <p className="text-2xs text-carbon/35 uppercase tracking-wider mb-0.5">Priority</p>
                <p className="text-sm font-medium text-carbon capitalize">{incident.priority || 'Medium'}</p>
              </div>
            </div>
          </div>

          {/* Response progress */}
          <div className="border border-carbon/12 rounded bg-white p-5">
            <p className="text-xs font-semibold text-carbon/40 uppercase tracking-wider mb-4">Response Progress</p>

            {/* Step dots */}
            <div className="relative flex items-center justify-between mb-6">
              {/* Line */}
              <div className="absolute left-0 right-0 h-px bg-carbon/10 top-3 z-0" />
              <div
                className="absolute left-0 h-px bg-carbon top-3 z-0 transition-all duration-500"
                style={{ width: `${currentStepIdx >= 0 ? (currentStepIdx / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const done    = idx < currentStepIdx
                const current = idx === currentStepIdx
                return (
                  <div key={step} className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      current ? 'border-carbon bg-carbon' :
                      done    ? 'border-carbon bg-carbon' :
                               'border-carbon/20 bg-white'
                    }`}>
                      {(done || current) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Step labels */}
            <div className="flex items-start justify-between">
              {STEP_LABELS.map((label, idx) => {
                const done    = idx < currentStepIdx
                const current = idx === currentStepIdx
                return (
                  <div key={label} className="flex flex-col items-center text-center w-16">
                    <p className={`text-2xs font-medium ${current ? 'text-carbon' : done ? 'text-carbon/50' : 'text-carbon/25'}`}>
                      {label}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Next step label */}
            <div className="mt-5 pt-4 border-t border-carbon/8">
              <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-1">Next Step</p>
              <p className="text-xs text-carbon/60">Update your status so the operations centre stays informed.</p>
            </div>

            {/* Action button */}
            <button
              onClick={() => navigate(`/rescue/status/${incident._id}`)}
              className="mt-4 w-full bg-carbon text-white text-sm font-semibold py-3.5 rounded flex items-center justify-between px-5 hover:bg-carbon/90 transition-colors"
            >
              <span>
                {currentStepIdx < STATUS_STEPS.length - 1
                  ? `${STEP_LABELS[currentStepIdx + 1] ? 'Mark as ' + STEP_LABELS[Math.min(currentStepIdx + 1, STATUS_STEPS.length - 1)] : 'Update Status'}`
                  : 'View Assignment History'
                }
              </span>
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Right: map + contacts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Navigate */}
          <div className="border border-carbon/12 rounded bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-carbon/40 uppercase tracking-wider">Navigate</p>
              {incident.location?.latitude && incident.location?.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${incident.location.latitude},${incident.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-carbon/50 hover:text-carbon border border-carbon/15 rounded px-2 py-1 transition-colors"
                >
                  <Navigation size={11} strokeWidth={1.75} />
                  Open Maps
                </a>
              )}
            </div>
            <MapPlaceholder
              height="h-36"
              incidents={[incident]}
              locationLabel={incident.location?.address || 'Location pending'}
            />
            <p className="text-xs text-carbon/40 mt-2 flex items-center gap-1">
              <MapPin size={11} />
              {incident.location?.address || 'Location coordinates available'}
            </p>
          </div>

          {/* Emergency contacts */}
          <div className="border border-carbon/12 rounded bg-white p-4">
            <p className="text-xs font-semibold text-carbon/40 uppercase tracking-wider mb-3">Emergency Contacts</p>
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map((c) => (
                <div key={c.name} className="flex items-center justify-between py-2 border-b border-carbon/6 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-carbon">{c.name}</p>
                    <p className="text-2xs text-carbon/40">{c.number}</p>
                  </div>
                  <a
                    href={`tel:${c.number}`}
                    className="w-7 h-7 rounded-full border border-carbon/15 flex items-center justify-center hover:bg-carbon hover:text-white hover:border-carbon transition-all"
                    aria-label={`Call ${c.name}`}
                  >
                    <Phone size={11} strokeWidth={1.75} className="text-carbon/50" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Reporter Contact */}
          {incident.reporter && (
            <div className="border border-carbon/12 rounded bg-white p-4">
              <p className="text-xs font-semibold text-carbon/40 uppercase tracking-wider mb-3">Reporter Contact</p>
              <div>
                <p className="text-sm font-medium text-carbon">{incident.reporter.name}</p>
                {incident.reporter.phone && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-carbon/40">{incident.reporter.phone}</p>
                    <a
                      href={`tel:${incident.reporter.phone}`}
                      className="w-7 h-7 rounded-full border border-carbon/15 flex items-center justify-center hover:bg-carbon hover:text-white hover:border-carbon transition-all"
                    >
                      <Phone size={11} strokeWidth={1.75} className="text-carbon/50" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
