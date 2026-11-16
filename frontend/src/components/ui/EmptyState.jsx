import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-carbon/5 flex items-center justify-center mb-4">
          <Icon size={22} className="text-carbon/30" strokeWidth={1.5} />
        </div>
      )}
      <p className="font-medium text-carbon/70 mb-1">{title}</p>
      {description && <p className="text-sm text-carbon/40 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
