import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Users, UserPlus } from 'lucide-react'
import { getIncident } from '../../services/incidentService'
import { getRescueTeams, assignIncident, updateIncident } from '../../services/adminService'
import { formatRelativeTime, STATUS_LABELS } from '../../data/store'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [assignedTeam, setAssignedTeam] = useState(null)
  const [availableTeams, setAvailableTeams] = useState([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        setLoading(true)
        
        // Fetch incident
        const incidentData = await getIncident(id)
        
        if (!incidentData) {
          setError('Incident not found')
          return
        }
        
        // Transform incident to match frontend format
        const transformedIncident = {
          id: incidentData._id,
          description: incidentData.message || incidentData.description || 'No description',
          fullDescription: incidentData.message || incidentData.description || '',
          category: incidentData.category,
          verifiedSeverity: incidentData.urgency || incidentData.priority || 'medium',
          status: incidentData.status,
          locationText: incidentData.location?.address || 
                       `${incidentData.location?.coordinates?.[1]}, ${incidentData.location?.coordinates?.[0]}` || 
                       'Unknown',
          location: incidentData.location,
          createdAt: incidentData.createdAt,
          reporter: incidentData.reporter,
          reporterName: incidentData.reporter?.name,
          reporterPhone: incidentData.reporter?.phone,
          assignedTeamId: incidentData.assignedRescueTeam?._id,
          notes: incidentData.notes,
          urgency: incidentData.urgency,
          priority: incidentData.priority,
          peopleAffected: incidentData.peopleAffected,
          reporterUrgency: incidentData.reporterUrgency,
          classification: {
            bertweetCategory: incidentData.category,
            confidence: incidentData.confidence || 0,
            aiUrgency: incidentData.urgency || 'UNKNOWN',
            humanitarianStatus: incidentData.humanitarian !== false,
            geminiUsed: incidentData.modelUsed === 'Gemini',
            explanation: incidentData.explanation
          },
          statusHistory: (incidentData.statusHistory || []).map(h => ({
            status: h.status,
            timestamp: h.updatedAt || h.timestamp,
            note: h.notes
          }))
        }
        
        setIncident(transformedIncident)
        
        // Fetch assigned team if any
        if (incidentData.assignedRescueTeam) {
          setAssignedTeam({
            id: incidentData.assignedRescueTeam._id,
            fullName: incidentData.assignedRescueTeam.name,
            memberCount: 5, // Default
            deploymentStatus: incidentData.status
          })
        }
        
        // Fetch available rescue teams
        const teams = await getRescueTeams()
        setAvailableTeams(teams)
        
      } catch (err) {
        console.error('Failed to fetch incident:', err)
        setError('Failed to load incident details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchIncidentDetails()
    }
  }, [id])

  const handleAssignTeam = async () => {
    if (!selectedTeamId) {
      alert('Please select a team')
      return
    }

    try {
      setAssigning(true)
      await assignIncident(id, selectedTeamId)
      
      // Refresh incident data
      const updatedIncident = await getIncident(id)
      const transformedIncident = {
        ...incident,
        status: updatedIncident.status,
        assignedTeamId: updatedIncident.assignedRescueTeam?._id,
      }
      setIncident(transformedIncident)
      
      if (updatedIncident.assignedRescueTeam) {
        setAssignedTeam({
          id: updatedIncident.assignedRescueTeam._id,
          fullName: updatedIncident.assignedRescueTeam.name,
          memberCount: 5,
          deploymentStatus: updatedIncident.status
        })
      }
      
      setShowAssignModal(false)
      setSelectedTeamId('')
    } catch (err) {
      console.error('Failed to assign team:', err)
      alert('Failed to assign team. Please try again.')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40 text-sm">Loading incident details...</p>
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40 text-sm">{error || 'Incident not found.'}</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-xs text-white/40 underline">Go back</button>
      </div>
    )
  }

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
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Assignment</p>
          {!assignedTeam && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-sage/20 hover:bg-sage/30 text-sage border border-sage/30 rounded transition-colors"
            >
              <UserPlus size={12} /> Assign Team
            </button>
          )}
        </div>
        {assignedTeam ? (
          <div>
            <p className="text-sm font-medium text-sage">{assignedTeam.fullName}</p>
            <p className="text-xs text-white/40">{assignedTeam.memberCount} members · {assignedTeam.deploymentStatus}</p>
          </div>
        ) : (
          <p className="text-xs text-white/30">No team assigned yet.</p>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-carbon border border-white/10 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Assign Rescue Team</h3>
            
            <div className="mb-4">
              <label className="text-xs text-white/60 mb-2 block">Select Team</label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/25"
              >
                <option value="" className="bg-carbon">Select a team...</option>
                {availableTeams.map(team => (
                  <option key={team._id} value={team._id} className="bg-carbon">
                    {team.name} - {team.teamId || team._id.slice(-6)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedTeamId('')
                }}
                className="flex-1 px-4 py-2 text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/25 rounded transition-colors"
                disabled={assigning}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTeam}
                disabled={assigning || !selectedTeamId}
                className="flex-1 px-4 py-2 text-sm bg-sage hover:bg-sage/90 text-black rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

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
