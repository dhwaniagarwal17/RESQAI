import React from 'react'

const severityMap = {
  critical: 'bg-coral/10 text-coral border-coral/30',
  high:     'bg-amber/10 text-amber border-amber/30',
  medium:   'bg-sage/10 text-sage border-sage/30',
  low:      'bg-carbon/10 text-carbon/60 border-carbon/20',
}

const statusMap = {
  submitted:    'bg-carbon/8 text-carbon/70 border-carbon/20',
  pending:      'bg-carbon/8 text-carbon/70 border-carbon/20', // legacy alias
  under_review: 'bg-amber/10 text-amber border-amber/30',
  assigned:     'bg-sage/15 text-sage border-sage/30',
  accepted:     'bg-sage/15 text-sage border-sage/30',
  en_route:     'bg-amber/10 text-amber border-amber/30',
  on_site:      'bg-coral/10 text-coral border-coral/30',
  resolved:     'bg-sage/15 text-sage border-sage/30',
  rejected:     'bg-coral/10 text-coral border-coral/30',
  cancelled:    'bg-carbon/8 text-carbon/60 border-carbon/15',
}

export function SeverityBadge({ severity }) {
  const label = severity
    ? severity.charAt(0).toUpperCase() + severity.slice(1)
    : '—'
  const cls = severityMap[severity] || 'bg-carbon/8 text-carbon/50 border-carbon/15'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium border tracking-wide uppercase ${cls}`}>
      {label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const labels = {
    submitted: 'Submitted',
    pending: 'Submitted',      // legacy alias
    under_review: 'Under Review',
    assigned: 'Assigned',
    accepted: 'Accepted',
    en_route: 'En Route',
    on_site: 'On Site',
    resolved: 'Resolved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  }
  const label = labels[status] || status
  const cls = statusMap[status] || 'bg-carbon/8 text-carbon/50 border-carbon/15'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium border tracking-wide ${cls}`}>
      {label}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium border bg-carbon/5 text-white/80 border-carbon/15 tracking-wide">
      {category}
    </span>
  )
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-carbon/8 text-carbon/70 border-carbon/20',
    coral:   'bg-coral/10 text-coral border-coral/30',
    sage:    'bg-sage/15 text-sage border-sage/30',
    amber:   'bg-amber/10 text-amber border-amber/30',
    ghost:   'bg-transparent text-carbon/50 border-carbon/15',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium border tracking-wide ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}
