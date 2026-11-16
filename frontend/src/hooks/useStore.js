import { useState, useEffect, useCallback } from 'react'
import {
  getIncidents,
  getTeams,
  getActiveRole,
  setActiveRole as storeSetRole,
  getStats,
} from '../data/store'

/**
 * Subscribes to the RESQAI data store.
 * Re-renders whenever localStorage data changes via the custom event.
 */
export function useStore() {
  const [incidents, setIncidents] = useState(() => getIncidents())
  const [teams, setTeams] = useState(() => getTeams())
  const [stats, setStats] = useState(() => getStats())
  const [role, setRoleState] = useState(() => getActiveRole())

  const refresh = useCallback(() => {
    setIncidents(getIncidents())
    setTeams(getTeams())
    setStats(getStats())
    setRoleState(getActiveRole())
  }, [])

  useEffect(() => {
    window.addEventListener('resqai_data_change', refresh)
    window.addEventListener('resqai_role_change', refresh)
    return () => {
      window.removeEventListener('resqai_data_change', refresh)
      window.removeEventListener('resqai_role_change', refresh)
    }
  }, [refresh])

  const setRole = useCallback((r) => {
    storeSetRole(r)
    setRoleState(r)
  }, [])

  return { incidents, teams, stats, role, setRole, refresh }
}
