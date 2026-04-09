'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { TEAM } from '@/lib/data'
import type { Role, TeamMember } from '@/lib/types'

interface TeamGridProps {
  role: Role
}

interface MemberCardProps {
  member: TeamMember
  showMetrics: boolean
}

function MemberCard({ member, showMetrics }: MemberCardProps) {
  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5 relative overflow-hidden hover:border-app-border/80 transition-colors">
      {/* Accent bar — role color */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: member.color }}
      />

      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-syne font-bold text-base mb-4"
        style={{
          background: `${member.color}18`,
          color: member.color,
          border: `1px solid ${member.color}35`,
        }}
      >
        {member.avatar}
      </div>

      {/* Identity */}
      <div className="font-syne font-bold text-text-primary text-base mb-0.5">
        {member.name}
      </div>
      <div className="font-dm text-xs mb-1" style={{ color: member.color }}>
        {member.roleLabel}
      </div>
      <div className="font-dm text-text-dim text-xs mb-4">{member.email}</div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
        <span className="font-dm text-text-dim text-xs">{member.status}</span>
      </div>

      {/* Metrics — hidden for secretary */}
      {showMetrics && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Tasks Open', value: member.tasksOpen },
            { label: 'Completed', value: member.tasksCompleted },
            { label: 'Docs Today', value: member.docsAccessed },
          ].map(({ label, value }) => (
            <div key={label} className="bg-app-surface rounded p-2 text-center">
              <div className="font-syne font-bold text-text-primary text-lg">
                {value}
              </div>
              <div className="font-dm text-text-dim text-xs leading-tight">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Working on */}
      <div>
        <div className="font-dm text-text-dim text-xs mb-1">Working on:</div>
        <div className="font-dm text-text-mid text-xs">{member.workingOn}</div>
      </div>

      {/* Last active */}
      <div className="mt-3 pt-3 border-t border-app-border">
        <span className="font-dm text-xs" style={{ color: member.color }}>
          {member.lastActive}
        </span>
      </div>
    </div>
  )
}

export function TeamGrid({ role }: TeamGridProps) {
  const showMetrics = role === 'owner'

  return (
    <div className="mb-8">
      <div className="mb-4">
        <SectionLabel>Team Members</SectionLabel>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {TEAM.map((member) => (
          <MemberCard key={member.id} member={member} showMetrics={showMetrics} />
        ))}
      </div>
    </div>
  )
}
