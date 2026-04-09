'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TASKS, getProject } from '@/lib/data'
import type { Role, Task } from '@/lib/types'

interface TaskPanelProps {
  role: Role
}

function getTasksForRole(role: Role): Task[] {
  return TASKS.filter((t) => !t.completed && t.assignedTo.includes(role)).sort(
    (a, b) => {
      const p = { high: 0, medium: 1, low: 2 }
      return p[a.priority] - p[b.priority]
    }
  )
}

function getPriorityDotColor(task: Task): string {
  if (task.overdue || task.priority === 'high') return 'bg-status-red'
  if (task.priority === 'medium') return 'bg-status-amber'
  return 'bg-status-blue'
}

export function TaskPanel({ role }: TaskPanelProps) {
  const router = useRouter()
  const tasks = getTasksForRole(role).slice(0, 5)

  return (
    <div>
      <SectionLabel>Open Tasks</SectionLabel>
      <div className="mt-3 space-y-2">
        {tasks.map((task) => {
          const project = getProject(task.projectId)
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 py-2.5 px-3 bg-app-card border border-app-border rounded hover-card cursor-pointer transition-all"
              onClick={() => router.push(`/deals/${task.projectId}`)}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityDotColor(task)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-dm text-text-primary text-xs truncate">
                  {task.title}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`font-dm text-[10px] ${
                    task.overdue ? 'text-status-red' : 'text-text-dim'
                  }`}
                >
                  {task.dueLabel}
                </span>
                {project && (
                  <Badge label={project.name.split(' ')[0]} color="dim" size="sm" />
                )}
              </div>
            </div>
          )
        })}
        {tasks.length === 0 && (
          <div className="text-text-dim text-sm font-dm py-2">No open tasks</div>
        )}
      </div>
    </div>
  )
}
