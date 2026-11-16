import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Bell, LogOut } from 'lucide-react'
import RoleSwitcher from './RoleSwitcher'
import { useStore } from '../../hooks/useStore'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Dashboard',  to: '/reporter',         icon: LayoutDashboard, end: true },
  { label: 'My Reports', to: '/reporter/reports',  icon: FileText },
]

export default function ReporterShell() {
  const { role, setRole } = useStore()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-linen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-carbon/10 bg-linen">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-carbon/10">
          <span className="text-base font-bold tracking-tight text-carbon">RESQAI</span>
        </div>

        {/* Section label */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-2xs font-semibold tracking-widest uppercase text-carbon/40">Citizen Portal</p>
          <p className="text-xs text-carbon/40 mt-0.5">Report &amp; Track</p>
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
                    ? 'bg-carbon text-white'
                    : 'text-carbon/60 hover:bg-carbon/8 hover:text-carbon'
                  }
                `}
              >
                <Icon size={14} strokeWidth={1.75} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-carbon/10 mt-auto">
          <RoleSwitcher activeRole={role} onRoleChange={setRole} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-carbon/10 bg-linen/80 backdrop-blur-sm">
          <div>
            <p className="text-sm font-semibold text-carbon">Citizen Portal</p>
            <p className="text-xs text-carbon/40">AI-Assisted Disaster Response</p>
          </div>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-carbon/8 transition-colors text-carbon/50 hover:text-carbon"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.75} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
          </button>
          <button
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-carbon/8 transition-colors text-carbon/50 hover:text-carbon"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={15} strokeWidth={1.75} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
