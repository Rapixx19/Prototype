'use client'

import { Sparkles } from 'lucide-react'

export interface BriefingCardProps {
  meetingCount: number
  taskCount: number
  alertCount: number
}

export function BriefingCard({ meetingCount, taskCount, alertCount }: BriefingCardProps) {
  return (
    <div className="bg-app-card border border-app-border rounded-xl p-4 border-l-2 border-l-accent">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-dm font-semibold text-text-primary text-sm">
            Morning Briefing
          </h3>
          <p className="font-dm text-text-mid text-xs mt-1">
            {meetingCount} meeting{meetingCount !== 1 ? 's' : ''} today · {taskCount} priority task{taskCount !== 1 ? 's' : ''}
            {alertCount > 0 && (
              <span className="text-gold"> · {alertCount} alert{alertCount !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
