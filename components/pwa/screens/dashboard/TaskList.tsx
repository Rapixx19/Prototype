'use client'

import { Circle, AlertCircle, Clock } from 'lucide-react'
import type { PWATask } from '@/lib/pwa/pwaTypes'

export interface TaskListProps {
  tasks: PWATask[]
  onTaskTap: (taskId: string) => void
}

export function TaskList({ tasks, onTaskTap }: TaskListProps) {
  const getDueLabelColor = (task: PWATask) => {
    if (task.overdue) return 'text-red-500'
    if (task.dueLabel === 'Today') return 'text-gold'
    return 'text-text-dim'
  }

  const getDueLabelIcon = (task: PWATask) => {
    if (task.overdue) return <AlertCircle className="w-3 h-3 text-red-500" />
    return <Clock className="w-3 h-3 text-text-dim" />
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskTap(task.id)}
          className="flex items-start gap-3 p-3 bg-app-card border border-app-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors"
        >
          {/* Checkbox placeholder */}
          <Circle className="w-4 h-4 text-text-dim flex-shrink-0 mt-0.5" />

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <p className="font-dm text-text-primary text-xs line-clamp-1">
              {task.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {getDueLabelIcon(task)}
              <span className={`font-dm text-[10px] ${getDueLabelColor(task)}`}>
                {task.dueLabel}
              </span>
              {task.priority === 'high' && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500/10 rounded text-red-500 font-dm text-[9px]">
                  High
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
