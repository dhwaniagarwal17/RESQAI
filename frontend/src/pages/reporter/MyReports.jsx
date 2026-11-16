import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Users, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getMyIncidents as apiGetMyIncidents } from '../../services/incidentService'
import { getIncidents, formatRelativeTime } from '../../data/store'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

const STATUS_FILTERS = ['All', 'submitted', 'under_review', 'assigned', 'accepted', 'en_route', 'on_site', 'resolved', 'rejected', 'cancelled']

function normaliseIncident(inc) {
  // Normalise backend (MongoDB) incident shape → frontend shape
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
    statusHistory: inc.statusHistory || [],
    assignedTeamId: inc.assignedRescueTeam?._id || inc.assignedTeamId || null,
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

export default function MyReports() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [incidents, setIncidents]   = useState([])
  const [loading,   setLoading]     = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchIncidents = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      if (isAuthenticated) {
        const data = await apiGetMyIncidents()
        setIncidents(data.map(normaliseIncident))
      } else {
        // Offline / demo mode
        setIncidents(getIncidents())
      }
    } catch (err) {
      setFetchError(err.message || 'Failed to load your reports.')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  const filtered = statusFilter === 'All'
    ? incidents
    : incidents.filter((i) => i.status === statusFilter || (statusFilter === 'submitted' && i.status === 'pending'))

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-carbon">My Reports</h1>
          <p className="text-xs text-carbon/40 mt-0.5">{incidents.length} total submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchIncidents}
            disabled={loading}
            className="p-1.5 rounded hover:bg-carbon/8 transition-colors text-carbon/50 hover:text-carbon disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => navigate('/reporter/report')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-carbon text-white text-xs font-medium rounded hover:bg-carbon/90 transition-colors"
          >
            + New Report
          </button>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-start gap-2 bg-coral/8 border border-coral/20 rounded p-3 mb-4">
          <AlertCircle size={13} className="text-coral mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-coral">{fetchError}</p>
            {!isAuthenticated && (
              <p className="text-2xs text-carbon/40 mt-0.5">Showing demo data. <button onClick={() => navigate('/login')} className="underline">Sign in</button> for real reports.</p>
            )}
          </div>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
              statusFilter === f
                ? 'bg-carbon text-white border-carbon'
                : 'bg-transparent text-carbon/60 border-carbon/20 hover:border-carbon/40'
            }`}
          >
            {f === 'All' ? 'All' : f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && incidents.length === 0 && (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="border border-carbon/8 rounded bg-white p-4 animate-pulse">
              <div className="h-3 bg-carbon/8 rounded w-1/4 mb-2" />
              <div className="h-4 bg-carbon/8 rounded w-3/4 mb-2" />
              <div className="h-3 bg-carbon/8 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState
          title="No reports found"
          description={statusFilter === 'All' ? "You haven't submitted any reports yet." : "No incidents match the selected filter."}
          action={
            statusFilter === 'All' ? (
              <button
                onClick={() => navigate('/reporter/report')}
                className="bg-carbon text-white text-xs font-medium px-4 py-2 rounded hover:bg-carbon/90 transition-colors"
              >
                Report an Emergency
              </button>
            ) : null
          }
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((inc) => (
            <button
              key={inc.id}
              onClick={() => navigate(`/reporter/reports/${inc.id}`)}
              className="w-full text-left border border-carbon/10 rounded bg-white p-4 hover:border-carbon/25 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-2xs font-mono text-carbon/35">{inc.id}</span>
                    <SeverityBadge severity={inc.verifiedSeverity} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="text-sm font-semibold text-carbon mb-0.5 truncate">{inc.description}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-2xs text-carbon/40">
                    <span className="flex items-center gap-0.5">
                      <Clock size={9} /> {formatRelativeTime(inc.createdAt)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MapPin size={9} /> {inc.locationText}
                    </span>
                    {inc.peopleAffected > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Users size={9} /> {inc.peopleAffected} affected
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <CategoryBadge category={inc.category} />
                  </div>
                </div>
                <ArrowRight size={14} className="text-carbon/20 group-hover:text-carbon/50 transition-colors mt-1 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
