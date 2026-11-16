import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react'
import { getIncidentById, getTeams, formatRelativeTime, STATUS_LABELS } from '../../data/store'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const incident = getIncidentById(id)
  const teams = getTeams()

  if (!incident) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40 text-sm">Incident not found.</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-xs text-white/40 underline">Go back</button>
      </div>
    )
  }

  const assignedTeam = incident.assignedTeamId
    ? teams.find((t) => t.id === incident.assignedTeamId)
    : null

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft size={12} /> Back to Incidents
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-mono text-white/30">{incident.id}</span>
          <SeverityBadge severity={incident.verifiedSeverity} />
          <StatusBadge status={incident.status} />
          <CategoryBadge category={incident.category} />
        </div>
        <h1 className="text-xl font-bold text-white leading-snug mb-2">{incident.description}</h1>
        <p className="text-sm text-white/50 leading-relaxed">{incident.fullDescription}</p>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Location', value: incident.locationText },
          { label: 'Reported', value: formatRelativeTime(incident.createdAt) },
          { label: 'People Affected', value: incident.peopleAffected || '—' },
          { label: 'Reporter Urgency', value: incident.reporterUrgency || '—' },
        ].map((item) => (
          <div key={item.label} className="border border-white/8 rounded p-3">
            <p className="text-2xs text-white/30 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className="text-sm font-medium text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Reporter info */}
      {incident.reporterName && (
        <div className="border border-white/8 rounded p-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Reporter</p>
          <p className="text-sm text-white">{incident.reporterName}</p>
          {incident.reporterPhone && <p className="text-xs text-white/40">{incident.reporterPhone}</p>}
        </div>
      )}

      {/* AI Classification */}
      {incident.classification && (
        <div className="border border-white/8 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">AI Classification</p>
            <span className="text-2xs text-white/25 border border-white/10 px-1.5 py-0.5 rounded">
              {incident.classification.geminiUsed ? 'Gemini + BERTweet' : 'BERTweet'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-white/30 mb-0.5">Category</p>
              <p className="text-white font-medium">{incident.classification.bertweetCategory}</p>
            </div>
            <div>
              <p className="text-white/30 mb-0.5">Confidence</p>
              <p className="text-white font-medium">{Math.round(incident.classification.confidence * 100)}%</p>
            </div>
            <div>
              <p className="text-white/30 mb-0.5">AI Urgency</p>
              <p className="text-white font-medium">{incident.classification.aiUrgency}</p>
            </div>
            <div>
              <p className="text-white/30 mb-0.5">Humanitarian</p>
              <p className="text-white font-medium">{incident.classification.humanitarianStatus ? 'Yes' : 'No'}</p>
            </div>
          </div>
          {incident.classification.explanation && (
            <p className="text-2xs text-white/30 mt-3 pt-3 border-t border-white/8 italic leading-relaxed">
              "{incident.classification.explanation}"
            </p>
          )}
        </div>
      )}

      {/* Assignment */}
      <div className="border border-white/8 rounded p-4">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Assignment</p>
        {assignedTeam ? (
          <div>
            <p className="text-sm font-medium text-sage">{assignedTeam.fullName}</p>
            <p className="text-xs text-white/40">{assignedTeam.memberCount} members · {assignedTeam.deploymentStatus}</p>
          </div>
        ) : (
          <p className="text-xs text-white/30">No team assigned yet.</p>
        )}
      </div>

      {/* Status history */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Status History</p>
        <div className="space-y-2">
          {(incident.statusHistory || []).map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
              <div>
                <span className="text-white font-medium">{STATUS_LABELS[h.status] || h.status}</span>
                <span className="text-white/30 ml-2">{formatRelativeTime(h.timestamp)}</span>
                {h.note && <p className="text-white/30 mt-0.5">{h.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
