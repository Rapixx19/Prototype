'use client'

import { useState } from 'react'
import { AlertBanner } from './dashboard/AlertBanner'
import { BriefingCard } from './dashboard/BriefingCard'
import { MeetingScroll } from './dashboard/MeetingScroll'
import { TaskList } from './dashboard/TaskList'
import {
  getTodayMeetings,
  getHighPriorityTasks,
  getUnreadNotifications,
} from '@/lib/pwa/pwaData'

export interface DashboardScreenProps {
  onNavigateToMeeting: (meetingId: string) => void
  onNavigateToTask: (taskId: string) => void
  onNavigateToNotification: (notificationId: string) => void
}

export function DashboardScreen({
  onNavigateToMeeting,
  onNavigateToTask,
  onNavigateToNotification,
}: DashboardScreenProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const todayMeetings = getTodayMeetings()
  const highPriorityTasks = getHighPriorityTasks()
  const unreadNotifications = getUnreadNotifications()

  // Find first unread alert notification that hasn't been dismissed
  const alertNotification = unreadNotifications.find(
    (n) => n.type === 'alert' && !dismissedAlerts.includes(n.id)
  )

  const handleDismissAlert = (notificationId: string) => {
    setDismissedAlerts((prev) => [...prev, notificationId])
  }

  return (
    <div className="h-full flex flex-col bg-app-bg overflow-y-auto">
      <div className="p-4 pb-20 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="font-syne font-bold text-text-primary text-lg">
            Good morning
          </h1>
          <p className="font-dm text-text-mid text-xs">
            Thursday, 10 April
          </p>
        </div>

        {/* Alert Banner */}
        {alertNotification && (
          <AlertBanner
            notification={alertNotification}
            onTap={() => onNavigateToNotification(alertNotification.id)}
            onDismiss={() => handleDismissAlert(alertNotification.id)}
          />
        )}

        {/* Morning Briefing Card */}
        <BriefingCard
          meetingCount={todayMeetings.length}
          taskCount={highPriorityTasks.length}
          alertCount={unreadNotifications.filter((n) => n.type === 'alert').length}
        />

        {/* Today's Meetings Section */}
        <div>
          <h2 className="font-dm font-semibold text-text-primary text-sm mb-3">
            Today&apos;s Meetings
          </h2>
          <MeetingScroll
            meetings={todayMeetings}
            onMeetingTap={onNavigateToMeeting}
          />
        </div>

        {/* Priority Tasks Section */}
        <div>
          <h2 className="font-dm font-semibold text-text-primary text-sm mb-3">
            Priority Tasks
          </h2>
          <TaskList
            tasks={highPriorityTasks.slice(0, 3)}
            onTaskTap={onNavigateToTask}
          />
        </div>
      </div>
    </div>
  )
}
