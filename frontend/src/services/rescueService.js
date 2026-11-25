import api from './api'

/**
 * Get incidents assigned to the current rescue team user.
 */
export async function getAssignedIncidents(status) {
  const params = status ? `?status=${status}` : ''
  const data = await api.get(`/rescue/incidents${params}`)
  return data.data?.incidents || []
}

/**
 * Get a single assigned incident's details.
 */
export async function getIncidentDetails(id) {
  const data = await api.get(`/rescue/incidents/${id}`)
  return data.data?.incident
}

/**
 * Update the status of an assigned incident.
 * Allowed: accepted | en_route | on_site | resolved
 */
export async function updateIncidentStatus(id, status, notes = '') {
  const data = await api.patch(`/rescue/incidents/${id}/status`, { status, notes })
  return data.data?.incident
}

/**
 * Add field notes to an assigned incident.
 */
export async function addNotes(id, notes) {
  const data = await api.post(`/rescue/incidents/${id}/notes`, { notes })
  return data.data?.incident
}
