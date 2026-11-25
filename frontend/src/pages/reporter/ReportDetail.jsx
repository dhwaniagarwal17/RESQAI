import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Users, CheckCircle, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getIncident as apiGetIncident } from '../../services/incidentService'
import { getIncidentById, formatRelativeTime, STATUS_LABELS } from '../../data/store'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'

const STATUS_STEPS = ['submitted', 'under_review', 'assigned', 'accepted', 'en_route', 'on_site', 'resolved']

function normalise(inc) {
  if (!inc) return null
  return {
    id: inc._id || inc.id,
    description: inc.message || inc.description,
    fullDescription: inc.message || inc.fullDescription,
    category: inc.category,
    reporterUrgency: inc.priority || inc.reporterUrgency,
    verifiedSeverity: inc.priority || inc.verifiedSeverity,
    locationText: inc.location?.address || inc.locationText || '—',
    peopleAffected: inc.peopleAffected || 0,
    createdAt: inc.createdAt,
    status: inc.status === 'pending' ? 'submitted' : inc.status,
    statusHistory: (inc.statusHistory || []).map((h) => ({
      status: h.status === 'pending' ? 'submitted' : h.status,
      timestamp: h.updatedAt || h.timestamp,
      note: h.notes || h.note,
    })),
    assignedTeamId: inc.assignedRescueTeam?._id || inc.assignedTeamId || null,
    assignedTeamName: inc.assignedRescueTeam?.name || null,
    reporterName: inc.reporter?.name || inc.reporterName,
    classification: inc.geminiUsed != null ? {
      bertweetCategory: inc.originalBertweetCategory,
      confidence: inc.confidence,
      geminiUsed: inc.geminiUsed,
      aiUrgency: inc.urgency,
      humanitarianStatus: inc.humanitarianStatus,
      explanation: inc.explanation,
    } : inc.classification,
  }
}

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [incident, setIncident] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (isAuthenticated) {
          const data = await apiGetIncident(id)
          setIncident(normalise(data))
        } else {
          const data = getIncidentById(id)
          setIncident(normalise(data))
        }
      } catch (err) {
        setError(err.message || 'Failed to load incident.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isAuthenticated])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={20} className="text-carbon/30 animate-spin" strokeWidth={1.5} />
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-carbon/40 text-sm">{error || 'Incident not found.'}</p>
        <button onClick={() => navigate('/reporter/reports')} className="mt-4 text-xs text-carbon underline">
          Back to My Reports
        </button>
      </div>
    )
  }

  const currentStepIdx = STATUS_STEPS.indexOf(incident.status)

  return (
    <div className="max-w-xl mx-auto px-6 py-8 space-y-7">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-carbon/50 hover:text-carbon transition-colors"
      >
        <ArrowLeft size={12} /> Back
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-mono text-carbon/35">{incident.id}</span>
          <SeverityBadge severity={incident.verifiedSeverity} />
          <StatusBadge status={incident.status} />
          <CategoryBadge category={incident.category} />
        </div>
        <h1 className="text-xl font-bold text-carbon leading-snug">{incident.description}</h1>
        <p className="text-sm text-carbon/60 mt-2 leading-relaxed">{incident.fullDescription}</p>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Location', value: incident.locationText },
          { label: 'Reported', value: formatRelativeTime(incident.createdAt) },
          { label: 'Category', value: incident.category },
          { label: 'People Affected', value: incident.peopleAffected || '—' },
        ].map((item) => (
          <div key={item.label} className="border border-carbon/10 rounded p-3 bg-white">
            <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className="text-sm font-medium text-carbon">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Status timeline */}
      <div>
        <h2 className="text-sm font-semibold text-carbon mb-3">Response Progress</h2>
        <div className="relative">
          <div className="absolute left-3 top-3 bottom-3 w-px bg-carbon/10" />
          <div className="space-y-3">
            {STATUS_STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIdx
              const isCurrent = idx === currentStepIdx
              const histEntry = incident.statusHistory?.find((h) => h.status === step)
              return (
                <div key={step} className="flex items-start gap-3 relative">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                    isCurrent ? 'border-coral bg-coral' :
                    isDone    ? 'border-carbon bg-carbon' :
                               'border-carbon/20 bg-linen'
                  }`}>
                    {isDone && !isCurrent && <CheckCircle size={10} className="text-white" strokeWidth={3} />}
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-xs font-medium ${isDone ? 'text-carbon' : 'text-carbon/30'}`}>
                      {STATUS_LABELS[step] || step}
                    </p>
                    {histEntry && (
                      <p className="text-2xs text-carbon/35 mt-0.5">
                        {formatRelativeTime(histEntry.timestamp)}
                        {histEntry.note ? ` · ${histEntry.note}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Classification */}
      {incident.classification && (
        <div className="border border-carbon/10 rounded p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-carbon/60 uppercase tracking-wider">AI Classification</p>
            <span className="text-2xs text-carbon/30 border border-carbon/10 px-1.5 py-0.5 rounded">
              {incident.classification.geminiUsed ? 'Gemini + BERTweet' : 'BERTweet'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-carbon/40 mb-0.5">Category</p>
              <p className="font-medium text-carbon">{incident.classification.bertweetCategory || incident.category}</p>
            </div>
            <div>
              <p className="text-carbon/40 mb-0.5">Confidence</p>
              <p className="font-medium text-carbon">
                {incident.classification.confidence ? `${Math.round(incident.classification.confidence * 100)}%` : '—'}
              </p>
            </div>
            <div>
              <p className="text-carbon/40 mb-0.5">AI Urgency</p>
              <p className="font-medium text-carbon">{incident.classification.aiUrgency || '—'}</p>
            </div>
            <div>
              <p className="text-carbon/40 mb-0.5">Humanitarian</p>
              <p className="font-medium text-carbon">
                {incident.classification.humanitarianStatus != null
                  ? (incident.classification.humanitarianStatus ? 'Yes' : 'No')
                  : '—'}
              </p>
            </div>
          </div>
          {incident.classification.explanation && (
            <p className="text-2xs text-carbon/40 mt-3 pt-3 border-t border-carbon/8 leading-relaxed italic">
              "{incident.classification.explanation}"
            </p>
          )}
        </div>
      )}

      {/* Assigned team */}
      {incident.assignedTeamId && (
        <div className="border border-sage/30 rounded p-4 bg-sage/5">
          <p className="text-xs font-semibold text-sage uppercase tracking-wider mb-1">Assigned Rescue Team</p>
          <p className="text-sm font-medium text-carbon">
            {incident.assignedTeamName || incident.assignedTeamId}
          </p>
        </div>
      )}
    </div>
  )
}
