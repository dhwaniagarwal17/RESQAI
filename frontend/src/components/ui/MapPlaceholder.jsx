import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

/**
 * Visual map placeholder used across all three dashboards.
 * Renders a grid-based street map mockup with incident dots.
 * No real mapping library — GPS/tile integration planned for Phase 6.
 */
export default function MapPlaceholder({
  height = 'h-64',
  incidents = [],
  label = 'SIMULATED — MAP INTEGRATION PENDING',
  locationLabel = null,
  dark = false,
}) {
  const bg = dark ? 'bg-carbon' : 'bg-[#EAE7E0]'
  const gridLine = dark ? 'stroke-white/8' : 'stroke-carbon/10'
  const roadLine = dark ? 'stroke-white/15' : 'stroke-carbon/20'
  const textColor = dark ? 'text-white/40' : 'text-carbon/40'
  const labelBg = dark ? 'bg-carbon/80 text-white/50' : 'bg-linen/80 text-carbon/50'

  // Fixed simulated marker positions (percent x,y)
  const defaultMarkers = [
    { x: 20, y: 55, severity: 'critical' },
    { x: 45, y: 40, severity: 'high' },
    { x: 60, y: 60, severity: 'high' },
    { x: 75, y: 35, severity: 'medium' },
    { x: 35, y: 70, severity: 'medium' },
    { x: 85, y: 55, severity: 'low' },
  ]

  const markers = incidents.length > 0
    ? incidents.slice(0, 8).map((inc, i) => ({
        x: 15 + (i * 13) % 72,
        y: 30 + (i * 17) % 45,
        severity: inc.verifiedSeverity || 'medium',
        id: inc.id,
      }))
    : defaultMarkers

  const severityColors = {
    critical: '#E45A49',
    high: '#D6A34D',
    medium: '#8BAFA5',
    low: '#171917',
  }

  return (
    <div className={`relative ${height} ${bg} rounded overflow-hidden border border-carbon/10`}>
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(23,25,23,0.06)'} strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="96" height="96" patternUnits="userSpaceOnUse">
            <rect width="96" height="96" fill="url(#smallGrid)"/>
            <path d="M 96 0 L 0 0 0 96" fill="none" stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(23,25,23,0.12)'} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Simulated roads */}
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke={dark ? 'rgba(255,255,255,0.12)' : 'rgba(23,25,23,0.18)'} strokeWidth="3"/>
        <line x1="30%" y1="0%" x2="30%" y2="100%" stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(23,25,23,0.12)'} strokeWidth="2"/>
        <line x1="65%" y1="0%" x2="65%" y2="100%" stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(23,25,23,0.12)'} strokeWidth="2"/>
        <line x1="0%" y1="28%" x2="100%" y2="28%" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(23,25,23,0.10)'} strokeWidth="1.5"/>
        <line x1="0%" y1="72%" x2="100%" y2="72%" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(23,25,23,0.10)'} strokeWidth="1.5"/>
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(23,25,23,0.10)'} strokeWidth="1.5"/>
      </svg>

      {/* Road labels */}
      <span className={`absolute text-2xs font-medium tracking-widest uppercase ${textColor}`} style={{ left: '12%', top: '52%' }}>
        MG Road
      </span>

      {/* Incident markers */}
      {markers.map((m, i) => (
        <div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          <div
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: severityColors[m.severity] || '#8BAFA5' }}
            title={m.id || m.severity}
          />
        </div>
      ))}

      {/* Location pin for single-location views */}
      {locationLabel && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-coral flex items-center justify-center shadow">
            <MapPin size={10} className="text-white" strokeWidth={2.5} />
          </div>
          <span className={`text-2xs font-medium ${dark ? 'text-white/60' : 'text-carbon/60'}`}>{locationLabel}</span>
        </div>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-2 right-2">
        <span className={`text-2xs px-2 py-0.5 rounded font-mono tracking-wide ${labelBg}`}>
          ◎ {label}
        </span>
      </div>
    </div>
  )
}
