'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { INSIGHTS } from '@/lib/data'
import { canAccess } from '@/lib/auth'
import type { Project, Role, Severity } from '@/lib/types'

interface ProjectInsightsProps {
  project: Project
  role: Role
}

const severityStyles: Record<Severity, string> = {
  high: 'bg-red-950/20 border-red-900/30',
  medium: 'bg-amber-950/20 border-amber-900/30',
  low: 'bg-blue-950/20 border-blue-900/30',
}

function severityBadgeColor(severity: Severity): 'red' | 'amber' | 'blue' {
  return { high: 'red', medium: 'amber', low: 'blue' }[severity] as 'red' | 'amber' | 'blue'
}

export function ProjectInsights({ project, role }: ProjectInsightsProps) {
  if (!canAccess(role, 'insights')) {
    return null
  }

  const projectInsights = INSIGHTS.filter(i => i.projectId === project.id)

  if (projectInsights.length === 0) {
    return null
  }

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5">
      <SectionLabel>Project Insights — AI detected</SectionLabel>
      <div className="mt-3 space-y-3">
        {projectInsights.map(insight => (
          <div
            key={insight.id}
            className={`rounded-lg p-4 border ${severityStyles[insight.severity]}`}
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
              <Badge
                label={insight.severity.toUpperCase()}
                color={severityBadgeColor(insight.severity)}
                size="sm"
              />
            </div>
            <p className="font-dm text-text-mid text-xs leading-relaxed">{insight.body}</p>
            <div className="font-dm text-text-dim text-xs mt-2">{insight.generatedAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
