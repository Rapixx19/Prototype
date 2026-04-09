'use client'

import { useSyncExternalStore, useCallback } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MorningBriefing } from '@/components/dashboard/MorningBriefing'
import { MeetingStrip } from '@/components/dashboard/MeetingStrip'
import { TaskPanel } from '@/components/dashboard/TaskPanel'
import { DocumentAlerts } from '@/components/dashboard/DocumentAlerts'
import { InsightsPanel } from '@/components/dashboard/InsightsPanel'
import { TeamStrip } from '@/components/dashboard/TeamStrip'
import { getRole } from '@/lib/auth'
import type { Role } from '@/lib/types'

function useRole() {
  const subscribe = useCallback(() => () => {}, [])
  const getSnapshot = useCallback(() => getRole(), [])
  const getServerSnapshot = useCallback(() => 'owner' as Role, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function useMounted() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    onStoreChange()
    return () => {}
  }, [])
  const getSnapshot = useCallback(() => true, [])
  const getServerSnapshot = useCallback(() => false, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function getGreeting(role: Role): string {
  if (role === 'owner') return 'Good morning, Alexandra.'
  if (role === 'secretary') return 'Good morning, Marcus.'
  if (role === 'employee') return 'Good morning, Priya.'
  return 'Good morning.'
}

export default function DashboardPage() {
  const role = useRole()
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <SectionLabel>Morning Briefing</SectionLabel>
          <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">
            {getGreeting(role)}
          </h1>
          <p className="font-dm text-text-dim text-sm mt-1">
            Thursday, 10 April 2025 &middot; London
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-dm text-status-green">
          <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          500 documents indexed &middot; OneDrive synced 07:14
        </div>
      </div>

      {/* Morning Briefing Card */}
      <MorningBriefing role={role} />

      {/* 3-column Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Col 1 — Today's Meetings (40%) */}
        <div className="col-span-5">
          <MeetingStrip role={role} />
        </div>

        {/* Col 2 — Tasks + Document Alerts (35%) */}
        <div className="col-span-4 space-y-6">
          <TaskPanel role={role} />
          <DocumentAlerts />
        </div>

        {/* Col 3 — Active Insights (25%) */}
        <div className="col-span-3">
          <InsightsPanel role={role} />
        </div>
      </div>

      {/* Team Strip — Full Width */}
      <TeamStrip role={role} />
    </div>
  )
}
