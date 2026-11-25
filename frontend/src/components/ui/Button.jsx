import React from 'react'

const variants = {
  primary:   'bg-carbon text-white hover:bg-carbon/90 border-carbon',
  coral:     'bg-coral text-white hover:bg-coral/90 border-coral',
  outline:   'bg-transparent text-carbon border-carbon/30 hover:bg-carbon/5',
  ghost:     'bg-transparent text-carbon/70 border-transparent hover:bg-carbon/5',
  sage:      'bg-sage text-white hover:bg-sage/90 border-sage',
  danger:    'bg-coral text-white hover:bg-coral/90 border-coral',
}

const sizes = {
  sm:  'px-3 py-1.5 text-xs',
  md:  'px-4 py-2 text-sm',
  lg:  'px-6 py-3 text-sm',
  xl:  'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium border rounded
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-coral/40
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
