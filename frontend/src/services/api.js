/**
 * RESQAI — Centralised API client
 *
 * All HTTP calls go through this module.
 * Base URL is read from VITE_API_URL env var, defaulting to the Vite proxy (/api).
 * JWT token is read from localStorage and attached automatically.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'resqai_jwt'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// ─── Core request function ────────────────────────────────────────────────────

/**
 * Make an authenticated API request.
 *
 * @param {string} path   - e.g. '/auth/login'
 * @param {object} options - fetch options (method, body, etc.)
 * @returns {Promise<any>} - Parsed JSON response data
 * @throws {ApiError}
 */
export async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Handle 401 — expired or invalid token
  if (response.status === 401) {
    clearToken()
    // Dispatch a custom event so the auth context can react
    window.dispatchEvent(new Event('resqai_session_expired'))
    throw new ApiError('Session expired. Please log in again.', 401)
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new ApiError('Invalid response from server', response.status)
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data?.errors
    )
  }

  return data
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const api = {
  get:    (path)         => request(path, { method: 'GET' }),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
}

// ─── ApiError class ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors // array of field-level validation errors
  }
}

export default api
