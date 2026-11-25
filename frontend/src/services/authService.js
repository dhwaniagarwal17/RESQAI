import api, { setToken, clearToken } from './api'

/**
 * Register a new user.
 * Returns { user, token }
 */
export async function register({ name, email, password, role, phone }) {
  const data = await api.post('/auth/register', { name, email, password, role, phone })
  if (data.data?.token) {
    setToken(data.data.token)
  }
  return data.data
}

/**
 * Login with email + password.
 * Returns { user, token }
 */
export async function login({ email, password }) {
  const data = await api.post('/auth/login', { email, password })
  if (data.data?.token) {
    setToken(data.data.token)
  }
  return data.data
}

/**
 * Fetch the currently authenticated user.
 * Returns { user }
 */
export async function getMe() {
  const data = await api.get('/auth/me')
  return data.data?.user
}

/**
 * Log out — clears local token.
 */
export function logout() {
  clearToken()
}
