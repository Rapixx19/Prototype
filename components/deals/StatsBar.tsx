'use client'

import { canAccess } from '@/lib/auth'
import type { Project, Role } from '@/lib/types'

interface StatsBarProps {
  project: Project
  role: Role
}

export function StatsBar({ project, role }: StatsBarProps) {
  const stats = [
    { label: 'Documents', value: String(project.documentIds.length), show: true },
    { label: 'Contacts', value: String(project.contactIds.length), show: true },
    { label: 'Target IRR', value: project.irr, show: canAccess(role, 'financial') },
    { label: 'Equity Deployed', value: project.equity, show: canAccess(role, 'financial') },
  ].filter(s => s.show)

  return (
    <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map(stat => (
        <div key={stat.label} className="bg-app-card border border-app-border rounded-lg p-5">
          <div className="font-dm text-xs text-gold uppercase tracking-widest font-semibold mb-2">
            {stat.label}
          </div>
          <div className="font-syne font-bold text-text-primary text-2xl">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}
