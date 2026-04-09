'use client'

import { useRouter } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { INSIGHTS } from '@/lib/data'
import { canAccess } from '@/lib/auth'
import type { Role } from '@/lib/types'

interface InsightsPanelProps {
  role: Role
}

export function InsightsPanel({ role }: InsightsPanelProps) {
  const router = useRouter()

  if (!canAccess(role, 'insights')) {
    return null
  }

  const topInsights = INSIGHTS.slice(0, 3)

  return (
    <div>
      <SectionLabel>Active Insights</SectionLabel>
      <div className="mt-3 space-y-3">
        {topInsights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-lg p-4 border cursor-pointer transition-all hover:opacity-90 ${
              insight.severity === 'high'
                ? 'bg-red-950/20 border-red-900/30'
                : insight.severity === 'medium'
                  ? 'bg-amber-950/20 border-amber-900/30'
                  : 'bg-blue-950/20 border-blue-900/30'
            }`}
            onClick={() => router.push('/insights')}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  insight.severity === 'high'
                    ? 'bg-status-red'
                    : insight.severity === 'medium'
                      ? 'bg-status-amber'
                      : 'bg-status-blue'
                }`}
              />
              <SectionLabel>{insight.type}</SectionLabel>
            </div>
            <p className="font-dm text-text-mid text-xs leading-relaxed line-clamp-3">
              {insight.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
