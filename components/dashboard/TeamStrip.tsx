'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { TEAM } from '@/lib/data'
import { canAccess } from '@/lib/auth'
import type { Role } from '@/lib/types'

interface TeamStripProps {
  role: Role
}

export function TeamStrip({ role }: TeamStripProps) {
  if (!canAccess(role, 'team_partial')) {
    return null
  }

  const showFull = canAccess(role, 'team_full')

  return (
    <div className="mt-6">
      <SectionLabel>Team Activity</SectionLabel>
      <div className="mt-3 grid grid-cols-4 gap-4">
        {TEAM.map((member) => (
          <div
            key={member.id}
            className="bg-app-card border border-app-border rounded-lg p-4 hover-card transition-all"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-bold text-sm mb-3"
              style={{
                background: `${member.color}20`,
                color: member.color,
                border: `1px solid ${member.color}40`,
              }}
            >
              {member.avatar}
            </div>
            <div className="font-syne font-semibold text-text-primary text-sm">
              {member.name}
            </div>
            {showFull && (
              <div className="font-dm text-text-dim text-xs mb-3">
                {member.roleLabel}
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-dm mt-2">
              <span className="text-text-dim">{member.tasksOpen} tasks open</span>
              <span className="text-text-dim">{member.docsAccessed} docs today</span>
            </div>
            <div className="mt-2 text-xs font-dm text-text-dim truncate">
              {member.workingOn}
            </div>
            <div className="mt-1 text-xs font-dm" style={{ color: member.color }}>
              {member.lastActive}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
