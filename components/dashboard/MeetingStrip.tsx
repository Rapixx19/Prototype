'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MEETINGS, getContact } from '@/lib/data'
import type { Role } from '@/lib/types'

interface MeetingStripProps {
  role: Role
}

function getAttendeeNames(attendeeIds: string[]): string {
  return attendeeIds
    .map((id) => getContact(id)?.name.split(' ')[1] || 'Unknown')
    .join(', ')
}

export function MeetingStrip({ role }: MeetingStripProps) {
  const router = useRouter()

  const todayMeetings = MEETINGS.filter((m) => m.isToday)

  const visibleMeetings =
    role === 'owner' || role === 'secretary'
      ? todayMeetings
      : todayMeetings.slice(0, 1)

  return (
    <div>
      <SectionLabel>Today&apos;s Meetings</SectionLabel>
      <div className="mt-3 space-y-3">
        {visibleMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-app-card border border-app-border rounded-lg p-4 hover-card cursor-pointer transition-all duration-200"
            onClick={() =>
              router.push(`/deals/${meeting.projectId}?meeting=${meeting.id}`)
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-syne font-bold text-gold text-lg">
                    {meeting.time}
                  </span>
                  <Badge
                    label={meeting.status === 'tentative' ? 'Tentative' : 'Confirmed'}
                    color={meeting.status === 'tentative' ? 'amber' : 'green'}
                  />
                </div>
                <div className="font-syne font-semibold text-text-primary text-sm mb-1">
                  {meeting.title}
                </div>
                <div className="font-dm text-text-dim text-xs">
                  {meeting.location} &middot; {getAttendeeNames(meeting.attendeeIds)}
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end gap-2">
                {meeting.briefReady ? (
                  <Badge label="Brief Ready" color="green" />
                ) : (
                  <Badge label="Pending" color="dim" />
                )}
                <span className="font-dm text-gold text-xs">View Brief &rarr;</span>
              </div>
            </div>
          </div>
        ))}
        {visibleMeetings.length === 0 && (
          <div className="text-text-dim text-sm font-dm">No meetings today</div>
        )}
      </div>
    </div>
  )
}
