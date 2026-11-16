import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import { useStore } from '../../hooks/useStore'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge'
import { formatRelativeTime } from '../../data/store'
import EmptyState from '../../components/ui/EmptyState'

const SEVERITY_OPTS = ['All', 'critical', 'high', 'medium', 'low']
const STATUS_OPTS  = ['All', 'submitted', 'under_review', 'assigned', 'accepted', 'en_route', 'on_site', 'resolved', 'rejected', 'cancelled']

export default function IncidentManagement() {
  const navigate = useNavigate()
  const { incidents } = useStore()
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('All')
  const [status, setStatus] = useState('All')
  const [view, setView] = useState('Cards') // Cards | Table

  const filtered = incidents.filter((inc) => {
    const matchSearch = !search ||
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.locationText?.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severity === 'All' || inc.verifiedSeverity === severity
    const matchStatus   = status === 'All'   || inc.status === status
    return matchSearch && matchSeverity && matchStatus
  })

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xs font-semibold tracking-widest uppercase text-white/40 mb-0.5">Incident Log</p>
          <p className="text-sm font-semibold text-white">All Incidents</p>
        </div>
        <div className="flex items-center gap-2">
          {['Cards', 'Table'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                view === v
                  ? 'border-white/30 text-white bg-white/10'
                  : 'border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents..."
            className="w-full bg-white/5 border border-white/10 rounded pl-8 pr-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/25"
          />
        </div>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/25"
        >
          {SEVERITY_OPTS.map((o) => (
            <option key={o} value={o} className="bg-carbon">{o === 'All' ? 'All severity' : o}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/25"
        >
          {STATUS_OPTS.map((o) => (
            <option key={o} value={o} className="bg-carbon">{o === 'All' ? 'All status' : o.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <p className="text-2xs text-white/30">{filtered.length} incident{filtered.length !== 1 ? 's' : ''}</p>

      {/* Incident cards */}
      {filtered.length === 0 ? (
        <EmptyState title="No incidents match" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((inc) => (
            <button
              key={inc.id}
              onClick={() => navigate(`/admin/incidents/${inc.id}`)}
              className="text-left border border-white/8 rounded p-4 hover:bg-white/5 hover:border-white/15 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xs font-mono text-white/30">{inc.id}</span>
                <SeverityBadge severity={inc.verifiedSeverity} />
              </div>
              <p className="text-sm font-semibold text-white/85 leading-snug mb-1 group-hover:text-white">
                {inc.description}
              </p>
              <p className="text-2xs text-white/35 mb-2.5 line-clamp-2 leading-relaxed">
                {inc.fullDescription}
              </p>
              <div className="flex items-center gap-2 text-2xs text-white/30 mb-2.5">
                <MapPin size={9} /> {inc.locationText}
                <span>·</span>
                <Clock size={9} /> {formatRelativeTime(inc.createdAt)}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusBadge status={inc.status} />
                <CategoryBadge category={inc.category} />
                {!inc.assignedTeamId && !['resolved','cancelled'].includes(inc.status) && (
                  <span className="ml-auto text-2xs text-sage/60 hover:text-sage">Assign →</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
