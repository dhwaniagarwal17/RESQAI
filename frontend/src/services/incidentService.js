import api from './api'

/**
 * Create a new incident (reporter).
 * The backend will call the ML service and return the classified incident.
 */
export async function createIncident({ message, location }) {
  const data = await api.post('/incidents', { message, location })
  return data.data?.incident
}

/**
 * Get all incidents belonging to the current reporter.
 */
export async function getMyIncidents() {
  const data = await api.get('/incidents/my')
  return data.data?.incidents || []
}

/**
 * Get a single incident by ID.
 * Access-controlled: reporter sees own, rescue sees assigned, admin sees all.
 */
export async function getIncident(id) {
  const data = await api.get(`/incidents/${id}`)
  return data.data?.incident
}

/**
 * Update limited fields on a reporter's own incident (location, notes).
 */
export async function updateIncident(id, updates) {
  const data = await api.patch(`/incidents/${id}`, updates)
  return data.data?.incident
}
