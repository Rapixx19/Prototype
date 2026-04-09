'use client'

import { useRouter } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import type { Project, ProjectStatus } from '@/lib/types'

interface LinkedProjectProps {
  project: Project
}

function statusBadgeColor(status: ProjectStatus): 'green' | 'blue' | 'dim' | 'amber' {
  const colors: Record<ProjectStatus, 'green' | 'blue' | 'dim' | 'amber'> = {
    Active: 'green', Pipeline: 'blue', Completed: 'dim', 'On Hold': 'amber'
  }
  return colors[status] ?? 'dim'
}

export function LinkedProject({ project }: LinkedProjectProps) {
  const router = useRouter()

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5 mb-4">
      <SectionLabel>Linked Project</SectionLabel>
      <div
        className="mt-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push(`/deals/${project.id}`)}
      >
        <div>
          <div className="font-syne font-semibold text-text-primary text-sm">{project.name}</div>
          <div className="font-dm text-text-dim text-xs mt-1">
            {project.type} · {project.geography}
          </div>
        </div>
        <div className="text-right">
          <div className="font-syne font-bold text-gold text-sm">{project.value}</div>
          <div className="mt-1">
            <Badge label={project.status} color={statusBadgeColor(project.status)} />
          </div>
        </div>
      </div>
    </div>
  )
}
