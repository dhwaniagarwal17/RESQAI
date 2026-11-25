import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Zap, Users, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react'
import { getAllIncidents, getIncidentStats } from '../../services/adminService'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'
import { formatRelativeTime } from '../../data/store'

export default function AdminOverview() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [stats, setStats] = useState({
    active: 0,
    critical: 0,
    teamsDeployed: 0,
    teamsTotal: 10,
    resolvedToday: 0
  })
  const [loading, setLoading] = useState(true)

  // Fetch incidents and stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch incidents
        const incidentsResponse = await getAllIncidents({ limit: 100 })
        const apiIncidents = incidentsResponse.data?.incidents || []
        
        // Transform incidents
        const transformedIncidents = apiIncidents.map(inc => ({
          id: inc._id,
          description: inc.message || inc.description || 'No description',
          fullDescription: inc.message || inc.description || '',
          category: inc.category,
          verifiedSeverity: inc.urgency || inc.priority || 'medium',
          status: inc.status,
          locationText: inc.location?.address || `${inc.location?.coordinates?.[1]}, ${inc.location?.coordinates?.[0]}` || 'Unknown',
          location: inc.location,
          createdAt: inc.createdAt,
          reporter: inc.reporter,
          assignedTeamId: inc.assignedRescueTeam?._id,
          assignedTeam: inc.assignedRescueTeam,
        }))
        
        setIncidents(transformedIncidents)
        
        // Fetch stats
        try {
          const statsResponse = await getIncidentStats()
          const overview = statsResponse.overview || {}
          
          // Calculate stats
          const activeCount = transformedIncidents.filter(i => 
            !['resolved', 'cancelled', 'rejected'].includes(i.status)
          ).length
          
          const criticalCount = transformedIncidents.filter(i => 
            i.verifiedSeverity === 'critical' || i.verifiedSeverity === 'high'
          ).length
          
          const teamsDeployed = transformedIncidents.filter(i => 
            i.assignedTeamId && ['assigned', 'accepted', 'en_route', 'on_site'].includes(i.status)
          ).length
          
          const today = new Date().toDateString()
          const resolvedToday = transformedIncidents.filter(i => 
            i.status === 'resolved' && new Date(i.createdAt).toDateString() === today
          ).length
          
          setStats({
            active: activeCount,
            critical: criticalCount,
            teamsDeployed: teamsDeployed,
            teamsTotal: 10,
            resolvedToday: resolvedToday
          })
        } catch (error) {
          console.error('Failed to fetch stats:', error)
        }
        
      } catch (error) {
        console.error('Failed to fetch incidents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white/50">Loading dashboard...</div>
      </div>
    )
  }

  const recentFeed = incidents
    .filter(i => !['resolved', 'cancelled'].includes(i.status))
    .slice(0, 6)

  const metricCards = [
    {
      label: 'Active',
      sublabel: 'Open incidents',
      value: stats.active,
      icon: AlertTriangle,
      color: 'text-white',
      border: 'border-white/10',
    },
    {
      label: 'Critical',
      sublabel: 'Immediate action needed',
      value: stats.critical,
      icon: Zap,
      color: 'text-coral',
      border: 'border-coral/20',
    },
    {
      label: 'Teams Out',
      sublabel: `of ${stats.teamsTotal} total`,
      value: stats.teamsDeployed,
      icon: Users,
      color: 'text-sage',
      border: 'border-sage/20',
    },
    {
      label: 'Resolved',
      sublabel: 'Closed today',
      value: stats.resolvedToday,
      icon: CheckCircle,
      color: 'text-amber',
      border: 'border-amber/20',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`border ${card.border} rounded p-4 bg-white/5`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-2xs font-semibold tracking-widest uppercase text-white/60">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <Icon size={18} className={card.color} strokeWidth={1.5} />
              </div>
              <p className="text-xs text-white/70">{card.sublabel}</p>
            </div>
          )
        })}
      </div>

      {/* Map + feed layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Live feed */}
        <div className="border border-white/8 rounded overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-white/8">
            <p className="text-2xs font-semibold tracking-widest uppercase text-white/60">Live Feed</p>
            <p className="text-sm font-semibold text-white">Recent Activity</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5" style={{ maxHeight: '400px' }}>
            {recentFeed.map((inc) => (
              <button
                key={inc.id}
                onClick={() => navigate(`/admin/incidents/${inc.id}`)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-2xs font-mono text-white/50">{inc.id}</span>
                  <SeverityBadge severity={inc.verifiedSeverity} />
                </div>
                <p className="text-xs font-semibold text-white leading-snug mb-1 group-hover:text-white transition-colors">
                  {inc.description}
                </p>
                <div className="flex items-center gap-2 text-2xs text-white/50">
                  <span className="flex items-center gap-0.5">
                    <MapPin size={9} /> {inc.locationText}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={9} /> {formatRelativeTime(inc.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <StatusBadge status={inc.status} />
                  <CategoryBadge category={inc.category} />
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-white/8">
            <button
              onClick={() => navigate('/admin/incidents')}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
            >
              View all incidents <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="border border-white/8 rounded overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-white/8">
            <p className="text-2xs font-semibold tracking-widest uppercase text-white/60">System Status</p>
            <p className="text-sm font-semibold text-white">Operations Summary</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="border border-white/8 rounded p-3 bg-white/5">
              <p className="text-2xs text-white/50 uppercase tracking-wider mb-1">Total Incidents</p>
              <p className="text-2xl font-bold text-white">{incidents.length}</p>
            </div>
            <div className="border border-white/8 rounded p-3 bg-white/5">
              <p className="text-2xs text-white/50 uppercase tracking-wider mb-1">Response Teams</p>
              <p className="text-2xl font-bold text-white">{stats.teamsDeployed} / {stats.teamsTotal}</p>
              <p className="text-2xs text-white/50 mt-1">Currently deployed</p>
            </div>
            <div className="border border-white/8 rounded p-3 bg-white/5">
              <p className="text-2xs text-white/50 uppercase tracking-wider mb-1">Resolved Today</p>
              <p className="text-2xl font-bold text-sage">{stats.resolvedToday}</p>
              <p className="text-2xs text-white/50 mt-1">Operations completed</p>
            </div>
            <div className="border border-white/8 rounded p-3 bg-white/5">
              <p className="text-2xs text-white/50 uppercase tracking-wider mb-1">Pending Assignment</p>
              <p className="text-2xl font-bold text-amber">{incidents.filter(i => i.status === 'submitted' || i.status === 'under_review').length}</p>
              <p className="text-2xs text-white/50 mt-1">Awaiting team dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Incident log strip */}
      <div className="border border-white/8 rounded overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Recent Incidents</p>
          <button
            onClick={() => navigate('/admin/incidents')}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>

        <div className="p-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {incidents.slice(0, 6).map((inc) => (
            <button
              key={inc.id}
              onClick={() => navigate(`/admin/incidents/${inc.id}`)}
              className="text-left border border-white/8 rounded p-3 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xs font-mono text-white/50">{inc.id}</span>
                <SeverityBadge severity={inc.verifiedSeverity} />
              </div>
              <p className="text-xs font-semibold text-white leading-snug mb-1 group-hover:text-white">
                {inc.description}
              </p>
              <p className="text-2xs text-white/60 mb-2 line-clamp-2">{inc.fullDescription}</p>
              <div className="flex items-center gap-1 text-2xs text-white/50 mb-2">
                <MapPin size={9} />
                <span>{inc.locationText}</span>
                <span>·</span>
                <Clock size={9} />
                <span>{formatRelativeTime(inc.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusBadge status={inc.status} />
                <CategoryBadge category={inc.category} />
                {!inc.assignedTeamId && (
                  <span className="text-2xs text-sage ml-auto">Assign</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-white/8 text-center">
          <button
            onClick={() => navigate('/admin/incidents')}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors mx-auto"
          >
            Manage all incidents <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}
