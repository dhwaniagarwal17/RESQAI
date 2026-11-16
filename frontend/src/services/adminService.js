import api from './api'

/**
 * Get all incidents with optional filters.
 */
export async function getAllIncidents({ category, urgency, status, priority, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (urgency)  params.set('urgency', urgency)
  if (status)   params.set('status', status)
  if (priority) params.set('priority', priority)
  params.set('page', page)
  params.set('limit', limit)
  const data = await api.get(`/admin/incidents?${params}`)
  return data
}

/**
 * Get incident statistics.
 */
export async function getIncidentStats() {
  const data = await api.get('/admin/incidents/stats')
  return data.data
}

/**
 * Update an incident (status, priority, urgency, notes).
 */
export async function updateIncident(id, updates) {
  const data = await api.patch(`/admin/incidents/${id}`, updates)
  return data.data?.incident
}

/**
 * Assign a rescue team to an incident.
 */
export async function assignIncident(incidentId, rescueTeamId) {
  const data = await api.post(`/admin/incidents/${incidentId}/assign`, { rescueTeamId })
  return data.data?.incident
}

/**
 * Get all rescue team users.
 */
export async function getRescueTeams() {
  const data = await api.get('/admin/rescue-teams')
  return data.data?.rescueTeams || []
}
