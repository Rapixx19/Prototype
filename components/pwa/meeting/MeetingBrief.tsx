'use client'

import { ArrowLeft, Users, Hash, AlertCircle, FileText, Target } from 'lucide-react'
import { getPWAMeeting, PWA_MEETING_BRIEF } from '@/lib/pwa/pwaData'
import { AttendeeCard } from './AttendeeCard'
import { KeyItemCard } from './KeyItemCard'

export interface MeetingBriefProps {
  meetingId: string
  onBack: () => void
}

export function MeetingBrief({ meetingId, onBack }: MeetingBriefProps) {
  const meeting = getPWAMeeting(meetingId)
  const brief = PWA_MEETING_BRIEF

  if (!meeting) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="font-dm text-text-dim text-sm">Meeting not found</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-app-border">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-app-card flex items-center justify-center hover:bg-app-card2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-text-mid" />
        </button>
        <div>
          <span className="font-dm font-semibold text-text-primary text-sm">Meeting Brief</span>
          <p className="font-dm text-text-dim text-[10px]">{meeting.title}</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Summary */}
        <div>
          <p className="font-dm text-text-mid text-xs leading-relaxed">{brief.summary}</p>
        </div>

        {/* Objectives */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3.5 h-3.5 text-accent" />
            <span className="font-dm font-semibold text-text-primary text-xs uppercase tracking-wide">Objectives</span>
          </div>
          <div className="space-y-1.5">
            {brief.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-dm text-accent text-xs">•</span>
                <p className="font-dm text-text-mid text-xs">{obj}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attendees */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3.5 h-3.5 text-text-dim" />
            <span className="font-dm font-semibold text-text-primary text-xs uppercase tracking-wide">Attendees</span>
          </div>
          <div className="space-y-2">
            {brief.attendees.map((attendee) => (
              <AttendeeCard key={attendee.id} attendee={attendee} />
            ))}
          </div>
        </div>

        {/* Key Numbers */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-3.5 h-3.5 text-text-dim" />
            <span className="font-dm font-semibold text-text-primary text-xs uppercase tracking-wide">Key Numbers</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {brief.keyNumbers.map((num, i) => (
              <div key={i} className="p-3 bg-app-card rounded-xl">
                <p className="font-dm text-text-dim text-[10px] mb-0.5">{num.label}</p>
                <p className="font-syne font-bold text-text-primary text-lg">{num.value}</p>
                {num.note && <p className="font-dm text-accent text-[10px] mt-0.5">{num.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Key Items */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-text-dim" />
            <span className="font-dm font-semibold text-text-primary text-xs uppercase tracking-wide">Key Items</span>
          </div>
          <div className="space-y-2">
            {brief.keyItems.map((item) => (
              <KeyItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-3.5 h-3.5 text-text-dim" />
            <span className="font-dm font-semibold text-text-primary text-xs uppercase tracking-wide">Documents</span>
          </div>
          <div className="space-y-1.5">
            {brief.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2.5 bg-app-card rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-dm text-text-primary text-xs truncate">{doc.name}</p>
                  <p className="font-dm text-text-dim text-[10px]">{doc.type} · {doc.size}</p>
                </div>
                {doc.relevance === 'high' && (
                  <span className="px-1.5 py-0.5 bg-accent/20 text-accent rounded text-[9px] font-dm">Key</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
