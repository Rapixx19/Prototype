'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
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
  onNavigateToPhotoUpload?: () => void
}

export function DashboardScreen({
  onNavigateToMeeting,
  onNavigateToTask,
  onNavigateToNotification,
  onNavigateToPhotoUpload,
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
    <div className="h-full flex flex-col bg-app-bg overflow-y-auto relative">
      <div className="p-4 pb-20 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-syne font-bold text-text-primary text-lg">
              Good morning
            </h1>
            <p className="font-dm text-text-mid text-xs">
              Thursday, 10 April
            </p>
          </div>
          {/* Capture Document Button */}
          {onNavigateToPhotoUpload && (
            <button
              onClick={onNavigateToPhotoUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors"
            >
              <Camera className="w-4 h-4 text-accent" />
              <span className="font-dm text-accent text-xs font-medium">Capture</span>
            </button>
          )}
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
