import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe, logout as serviceLogout } from '../services/authService'
import { getToken, clearToken } from '../services/api'

/**
 * AuthContext — provides current user, role, login state, and session management.
 *
 * Consumers: useAuth()
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)   // { id, name, email, role, teamId }
  const [loading, setLoading] = useState(true)   // initial session check
  const [error, setError]     = useState(null)

  // On mount, restore session from stored token
  useEffect(() => {
    async function restoreSession() {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const me = await getMe()
        setUser(me)
      } catch {
        // Token invalid or expired — clear it silently
        clearToken()
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  // Listen for session-expired events dispatched by the API client
  useEffect(() => {
    function onExpired() {
      setUser(null)
      setError('Your session has expired. Please log in again.')
    }
    window.addEventListener('resqai_session_expired', onExpired)
    return () => window.removeEventListener('resqai_session_expired', onExpired)
  }, [])

  const setLoggedInUser = useCallback((userData) => {
    setUser(userData)
    setError(null)
  }, [])

  const logout = useCallback(() => {
    serviceLogout()
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    role: user?.role || null,
    setLoggedInUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
