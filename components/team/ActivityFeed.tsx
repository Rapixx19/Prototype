'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { TEAM, ACTIVITY } from '@/lib/data'

export function ActivityFeed() {
  return (
    <div className="bg-app-card border border-app-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Team Activity Feed</SectionLabel>
        <span className="font-dm text-text-dim text-xs">
          Live · Updates every 60s
        </span>
      </div>

      <div className="space-y-0">
        {ACTIVITY.map((item) => {
          const member = TEAM.find((t) => t.id === item.userId)
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 py-3 border-b border-app-border last:border-0"
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-syne font-bold text-xs flex-shrink-0"
                style={{
                  background: `${member?.color}18`,
                  color: member?.color,
                }}
              >
                {member?.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="font-dm font-medium text-text-primary text-sm">
                  {member?.name}{' '}
                </span>
                <span className="font-dm text-text-mid text-sm">
                  {item.action}{' '}
                </span>
                <span className="font-dm font-medium text-accent text-sm">
                  {item.resource}
                </span>
              </div>

              {/* Time */}
              <span className="font-dm text-text-dim text-xs flex-shrink-0">
                {item.timeAgo}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
