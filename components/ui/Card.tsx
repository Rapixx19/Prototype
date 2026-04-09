import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  accent?: boolean
  className?: string
}

export function Card({ children, onClick, accent = false, className = '' }: CardProps) {
  const baseClasses = 'bg-app-card border border-app-border rounded-lg'
  const interactiveClasses = onClick ? 'cursor-pointer hover-card transition-all duration-200' : ''
  const accentClasses = accent ? 'border-t-2 border-t-gold' : ''

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${accentClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  )
}
