'use client'

import type { PWAAttendee } from '@/lib/pwa/pwaTypes'

interface AttendeeCardProps {
  attendee: PWAAttendee
}

const getRelationshipColor = (relationship: PWAAttendee['relationship']) => {
  switch (relationship) {
    case 'Strong': return 'bg-emerald-500'
    case 'Active': return 'bg-accent'
    case 'Dormant': return 'bg-gold'
    case 'Cold': return 'bg-rose-500'
  }
}

export function AttendeeCard({ attendee }: AttendeeCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-app-card rounded-xl">
      <div className="w-10 h-10 rounded-full bg-app-card2 flex items-center justify-center flex-shrink-0">
        <span className="font-dm font-semibold text-text-primary text-sm">{attendee.avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-dm font-semibold text-text-primary text-sm truncate">{attendee.name}</h4>
          <div className={`w-2 h-2 rounded-full ${getRelationshipColor(attendee.relationship)}`} />
        </div>
        <p className="font-dm text-text-dim text-xs truncate">{attendee.role} · {attendee.company}</p>
        <p className="font-dm text-text-dim text-[10px] mt-0.5">Last: {attendee.lastInteraction}</p>
      </div>
    </div>
  )
}
