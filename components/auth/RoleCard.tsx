'use client'

import type { Role } from '@/lib/types'
import type { ReactNode } from 'react'

interface RoleCardProps {
  role: Role
  label: string
  description: string
  access: string[]
  color: string
  icon: ReactNode
  onClick: () => void
}

export function RoleCard({
  label,
  description,
  access,
  color,
  icon,
  onClick,
}: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-app-card border border-app-border rounded-lg p-6 hover:border-accent-border hover:bg-app-card2 transition-all duration-200 cursor-pointer group"
      style={{ borderTopColor: color, borderTopWidth: '2px' }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}40`,
        }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      <div className="font-syne font-bold text-text-primary text-lg mb-1">
        {label}
      </div>

      <div className="font-dm text-text-mid text-sm mb-4">{description}</div>

      <div className="space-y-1.5 mb-4">
        {access.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="font-dm text-text-dim text-xs">{item}</span>
          </div>
        ))}
      </div>

      <div
        className="font-dm text-sm font-medium group-hover:translate-x-1 transition-transform"
        style={{ color }}
      >
        Login as {label.split(' / ')[0]} &rarr;
      </div>
    </button>
  )
}
