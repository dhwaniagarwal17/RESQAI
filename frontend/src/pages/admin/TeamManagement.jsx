import React, { useState, useEffect } from 'react'
import { Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { getRescueTeams, getAllIncidents } from '../../services/adminService'

export default function TeamManagement() {
  const [teams, setTeams] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch rescue teams
        const teamsData = await getRescueTeams()
        
        // Fetch incidents to see which teams are deployed
        const incidentsResponse = await getAllIncidents({ limit: 1000 })
        const apiIncidents = incidentsResponse.data?.incidents || []
        setIncidents(apiIncidents)
        
        // Transform teams to match frontend format
        const transformedTeams = teamsData.map(team => {
          // Find if team has any active assignments
          const activeIncident = apiIncidents.find(inc => 
            inc.assignedRescueTeam?._id === team._id && 
            ['assigned', 'accepted', 'en_route', 'on_site'].includes(inc.status)
          )
          
          const isDeployed = !!activeIncident
          
          return {
            id: team._id,
            fullName: team.name,
            teamId: team.teamId || team._id,
            base: 'Chandigarh HQ', // Default, can be added to backend model
            memberCount: team.members || 5, // Default, can be added to backend model
            members: team.members || 5,
            availability: isDeployed ? 'deployed' : 'available',
            currentIncidentId: activeIncident?._id || null,
            currentIncident: activeIncident,
            deploymentStatus: activeIncident?.status || null,
            phone: team.phone,
            email: team.email
          }
        })
        
        setTeams(transformedTeams)
      } catch (error) {
        console.error('Failed to fetch teams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white/50">Loading teams...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <p className="text-2xs font-semibold tracking-widest uppercase text-white/40 mb-0.5">Rescue Teams</p>
        <p className="text-sm font-semibold text-white">{teams.length} teams registered</p>
      </div>

      {teams.length === 0 ? (
        <div className="border border-white/8 rounded p-8 text-center">
          <Users size={32} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm text-white/40">No rescue teams registered yet</p>
          <p className="text-xs text-white/25 mt-1">Teams will appear here once they register in the system</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teams.map((team) => {
            const incident = team.currentIncident
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
                    <p className="text-2xs text-white/30 font-mono">{team.teamId}</p>
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

                {/* Member count */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-2xs text-white/60 font-medium">
                    <Users size={12} />
                  </div>
                  <span className="text-2xs text-white/30">{team.members || team.memberCount || 0} members active</span>
                </div>

                {/* Current assignment */}
                {incident ? (
                  <div className="border border-white/8 rounded p-2">
                    <p className="text-2xs text-white/30 mb-0.5">Current Assignment</p>
                    <p className="text-xs font-medium text-white">{incident.message || incident.description}</p>
                    <p className="text-2xs text-white/30 capitalize">{team.deploymentStatus?.replace('_', ' ')}</p>
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
      )}
    </div>
  )
}
