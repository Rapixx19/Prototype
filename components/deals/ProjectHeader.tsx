'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import type { Project, ProjectStatus } from '@/lib/types'

interface ProjectHeaderProps {
  project: Project
}

function statusBadgeColor(status: ProjectStatus): 'green' | 'blue' | 'dim' | 'amber' {
  const colors: Record<ProjectStatus, 'green' | 'blue' | 'dim' | 'amber'> = {
    Active: 'green', Pipeline: 'blue', Completed: 'dim', 'On Hold': 'amber'
  }
  return colors[status] ?? 'dim'
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <SectionLabel>Project Master File</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">{project.name}</h1>
        <p className="font-dm text-text-mid text-sm mt-1">
          {project.type} · {project.geography} · Started {project.started}
        </p>
      </div>
      <div className="text-right">
        <div className="font-syne font-bold text-gold text-3xl">{project.value}</div>
        <div className="mt-1">
          <Badge label={project.status} color={statusBadgeColor(project.status)} />
        </div>
        <div className="font-dm text-text-dim text-xs mt-1">Last activity: {project.lastActivity}</div>
      </div>
    </div>
  )
}
