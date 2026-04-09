'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { canAccess } from '@/lib/auth'
import type { Project, ProjectStatus, Role } from '@/lib/types'

interface ProjectCardProps {
  project: Project
  role: Role
}

function statusColor(status: ProjectStatus): string {
  return { Active: '#00D68F', Pipeline: '#4A9EFF', Completed: '#4A5568', 'On Hold': '#F5A623' }[status] ?? '#4A5568'
}

function statusBadgeColor(status: ProjectStatus): 'green' | 'blue' | 'dim' | 'amber' {
  const colors: Record<ProjectStatus, 'green' | 'blue' | 'dim' | 'amber'> = {
    Active: 'green', Pipeline: 'blue', Completed: 'dim', 'On Hold': 'amber'
  }
  return colors[status] ?? 'dim'
}

export function ProjectCard({ project, role }: ProjectCardProps) {
  const router = useRouter()

  return (
    <div
      className="bg-app-card border border-app-border rounded-lg overflow-hidden hover-card cursor-pointer transition-all duration-200 relative"
      onClick={() => router.push(`/deals/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/deals/${project.id}`)}
    >
      {/* Status color bar */}
      <div className="h-0.5 w-full" style={{ background: statusColor(project.status) }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-3">
            <h3 className="font-syne font-bold text-text-primary text-base leading-tight">
              {project.name}
            </h3>
            <p className="font-dm text-text-dim text-xs mt-1">
              {project.type} · {project.geography}
            </p>
          </div>
          <Badge label={project.status} color={statusBadgeColor(project.status)} />
        </div>

        {/* Value row */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-syne font-bold text-gold text-xl">{project.value}</span>
          <span className="font-dm text-text-dim text-xs">{project.documentIds.length} documents</span>
        </div>

        {/* Metrics row — IRR and equity — Owner only */}
        {canAccess(role, 'financial') && (
          <div className="flex gap-4 mb-4">
            <div>
              <div className="font-dm text-text-dim text-xs">Target IRR</div>
              <div className="font-syne font-bold text-text-primary text-sm">{project.irr}</div>
            </div>
            <div>
              <div className="font-dm text-text-dim text-xs">Equity</div>
              <div className="font-syne font-bold text-text-primary text-sm">{project.equity}</div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-dm text-text-dim bg-app-border/50 rounded px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        {/* Risk flag */}
        {project.riskFlag && (
          <div className="mt-3 flex items-start gap-2 bg-red-950/20 border border-red-900/30 rounded p-2.5">
            <span className="text-status-red text-xs mt-0.5">⚠</span>
            <p className="font-dm text-status-red text-xs leading-relaxed">{project.riskFlag}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-app-border">
          <span className="font-dm text-text-dim text-xs">Last activity: {project.lastActivity}</span>
          <span className="font-dm text-accent text-xs">Open deal room →</span>
        </div>
      </div>
    </div>
  )
}
