import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { setActiveRole } from '../../data/store'
import { User, Shield, Truck } from 'lucide-react'

const roles = [
  { id: 'reporter', label: 'Citizen',      icon: User,   path: '/reporter' },
  { id: 'admin',    label: 'Admin',         icon: Shield, path: '/admin'    },
  { id: 'rescue',   label: 'Rescue Team',  icon: Truck,  path: '/rescue'   },
]

export default function RoleSwitcher({ activeRole, onRoleChange }) {
  const navigate = useNavigate()

  function handleSwitch(role) {
    setActiveRole(role.id)
    onRoleChange(role.id)
    navigate(role.path)
  }

  return (
    <div className="px-3 pb-4">
      <p className="text-2xs font-semibold tracking-widest uppercase text-current/40 mb-2 px-1 flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage/60" />
        Preview Role
      </p>
      <div className="flex flex-col gap-0.5">
        {roles.map((role) => {
          const Icon = role.icon
          const isActive = activeRole === role.id
          return (
            <button
              key={role.id}
              onClick={() => handleSwitch(role)}
              className={`
                w-full text-left px-3 py-2 rounded text-sm font-medium
                flex items-center gap-2 transition-all duration-150
                ${isActive
                  ? 'bg-current/15 text-current'
                  : 'text-current/50 hover:bg-current/8 hover:text-current/80'
                }
              `}
            >
              <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
              {role.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
