import React from 'react'
import { Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { useStore } from '../../hooks/useStore'
import { getIncidentById } from '../../data/store'

export default function TeamManagement() {
  const { teams } = useStore()

  return (
    <div className="p-6 space-y-4">
      <div>
        <p className="text-2xs font-semibold tracking-widest uppercase text-white/40 mb-0.5">Rescue Teams</p>
        <p className="text-sm font-semibold text-white">{teams.length} teams registered</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {teams.map((team) => {
          const incident = team.currentIncidentId ? getIncidentById(team.currentIncidentId) : null
          const isDeployed = team.availability === 'deployed'
          return (
            <div
              key={team.id}
              className={`border rounded p-4 transition-colors ${
                isDeployed
                  ? 'border-coral/20 bg-coral/5'
                  : 'border-sage/20 bg-sage/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-white">{team.fullName}</p>
                  <p className="text-2xs text-white/30 font-mono">{team.id}</p>
                </div>
                <span className={`flex items-center gap-1 text-2xs font-medium px-2 py-0.5 rounded border ${
                  isDeployed
                    ? 'text-coral border-coral/30 bg-coral/10'
                    : 'text-sage border-sage/30 bg-sage/10'
                }`}>
                  {isDeployed ? <AlertCircle size={9} /> : <CheckCircle size={9} />}
                  {isDeployed ? 'Deployed' : 'Available'}
                </span>
              </div>

              <p className="text-xs text-white/40 flex items-center gap-1 mb-2">
                <MapPin size={10} /> {team.base}
              </p>

              <p className="text-xs text-white/40 flex items-center gap-1 mb-3">
                <Users size={10} /> {team.memberCount} members
              </p>

              {/* Member avatars */}
              <div className="flex items-center gap-1 mb-3">
                {team.members.slice(0, 4).map((m, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-2xs text-white/60 font-medium"
                    title={m}
                  >
                    {m[0]}
                  </div>
                ))}
                {team.members.length > 4 && (
                  <div className="w-6 h-6 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-2xs text-white/40">
                    +{team.members.length - 4}
                  </div>
                )}
                <span className="text-2xs text-white/30 ml-1">{team.memberCount} members active</span>
              </div>

              {/* Current assignment */}
              {incident ? (
                <div className="border border-white/8 rounded p-2">
                  <p className="text-2xs text-white/30 mb-0.5">Current Assignment</p>
                  <p className="text-xs font-medium text-white">{incident.description}</p>
                  <p className="text-2xs text-white/30">{team.deploymentStatus}</p>
                </div>
              ) : (
                <div className="border border-white/8 rounded p-2">
                  <p className="text-2xs text-sage/60">Ready for assignment</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
