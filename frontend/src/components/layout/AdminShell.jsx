import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, Users, RefreshCw, Bell, LogOut } from 'lucide-react'
import RoleSwitcher from './RoleSwitcher'
import { useStore } from '../../hooks/useStore'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Overview',      to: '/admin',               icon: LayoutDashboard, end: true },
  { label: 'Incidents',     to: '/admin/incidents',     icon: AlertTriangle },
  { label: 'Rescue Teams',  to: '/admin/teams',         icon: Users },
]

export default function AdminShell() {
  const { role, setRole, refresh } = useStore()
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-carbon overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-white/8 bg-carbon text-white">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-white/8">
          <span className="text-base font-bold tracking-tight text-white">RESQAI</span>
        </div>

        {/* Section label */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-2xs font-semibold tracking-widest uppercase text-white/30">Operations</p>
          <p className="text-xs text-white/30 mt-0.5">Command Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-white/12 text-white'
                    : 'text-white/50 hover:bg-white/8 hover:text-white/80'
                  }
                `}
              >
                <Icon size={14} strokeWidth={1.75} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/8 mt-auto">
          <RoleSwitcher activeRole={role} onRoleChange={setRole} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#1C1E1C]">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/8 bg-carbon/60 backdrop-blur-sm">
          <div>
            <p className="text-sm font-semibold text-white">Operations Overview</p>
            <p className="text-xs text-white/30">Incident intelligence dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors"
            >
              <RefreshCw size={12} strokeWidth={1.75} />
              Refresh
            </button>
            <button
              className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors text-white/50 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={16} strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors text-white/50 hover:text-white"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={15} strokeWidth={1.75} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
