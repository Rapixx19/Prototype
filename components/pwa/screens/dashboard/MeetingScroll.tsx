'use client'

import { MapPin, FileText } from 'lucide-react'
import type { PWAMeeting } from '@/lib/pwa/pwaTypes'

export interface MeetingScrollProps {
  meetings: PWAMeeting[]
  onMeetingTap: (meetingId: string) => void
}

export function MeetingScroll({ meetings, onMeetingTap }: MeetingScrollProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-3 snap-x snap-mandatory">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onMeetingTap(meeting.id)}
            className="w-[140px] flex-shrink-0 snap-start bg-app-card border border-app-border rounded-xl p-3 cursor-pointer hover:border-accent/50 transition-colors"
          >
            {/* Status dot + time */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  meeting.status === 'confirmed' ? 'bg-emerald-500' :
                  meeting.status === 'tentative' ? 'bg-gold' : 'bg-red-500'
                }`}
              />
              <span className="font-dm font-semibold text-text-primary text-xs">
                {meeting.time}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-dm font-medium text-text-primary text-xs line-clamp-2 min-h-[2rem] mb-2">
              {meeting.title}
            </h4>

            {/* Location */}
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3 h-3 text-text-dim flex-shrink-0" />
              <span className="font-dm text-text-dim text-[10px] truncate">
                {meeting.location}
              </span>
            </div>

            {/* Brief ready badge */}
            {meeting.briefReady && (
              <div className="flex items-center gap-1 bg-emerald-500/10 rounded-md px-2 py-1">
                <FileText className="w-3 h-3 text-emerald-500" />
                <span className="font-dm text-emerald-500 text-[10px]">Brief ready</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
