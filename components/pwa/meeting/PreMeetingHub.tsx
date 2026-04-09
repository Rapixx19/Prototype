'use client'

import { ArrowLeft, MapPin, FileText, MessageSquare, Clock, ChevronRight, Mic } from 'lucide-react'
import {
  getPWAMeeting,
  PWA_ROUTES,
  PWA_MEETING_BRIEF,
  getMeetingAttendees
} from '@/lib/pwa/pwaData'
import type { PhoneScreen } from '@/lib/pwa/pwaTypes'

export interface PreMeetingHubProps {
  meetingId: string
  onNavigate: (screen: PhoneScreen) => void
  onBack: () => void
}

export function PreMeetingHub({ meetingId, onNavigate, onBack }: PreMeetingHubProps) {
  const meeting = getPWAMeeting(meetingId)
  const bestRoute = PWA_ROUTES[0]
  const brief = PWA_MEETING_BRIEF
  const attendees = meeting ? getMeetingAttendees(meeting.attendeeIds) : []

  if (!meeting) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="font-dm text-text-dim text-sm">Meeting not found</p>
      </div>
    )
  }

  // Calculate leave-by progress
  // Current time: 08:30, Leave by: 08:55 = 25 mins
  // For demo, we'll show about 60% remaining
  const leaveByProgress = 60

  // Determine progress bar color
  const getProgressColor = () => {
    if (leaveByProgress > 50) return 'bg-emerald-500'
    if (leaveByProgress > 25) return 'bg-gold'
    return 'bg-rose-500'
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header with back button */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-app-card flex items-center justify-center hover:bg-app-card2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-text-mid" />
        </button>
        <span className="font-dm text-text-dim text-sm">Pre-Meeting</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Meeting Info */}
        <div className="mb-4">
          <h1 className="font-syne font-bold text-text-primary text-xl mb-1">
            {meeting.title}
          </h1>
          <div className="flex items-center gap-2 text-text-mid">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-dm text-sm">
              {meeting.time} · {meeting.location}
            </span>
          </div>
        </div>

        {/* Leave By Progress Bar */}
        <div className="bg-app-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-dm text-text-dim text-xs">Time until departure</span>
            <span className="font-dm font-semibold text-gold text-sm">
              Leave by {meeting.leaveBy}
            </span>
          </div>
          <div className="h-2 bg-app-card2 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} rounded-full transition-all`}
              style={{ width: `${leaveByProgress}%` }}
            />
          </div>
          <p className="font-dm text-text-dim text-xs mt-2">
            {meeting.travelTime} travel time · {meeting.address}
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-3">
          {/* Card 1: Getting There */}
          <button
            onClick={() => onNavigate('getting-there')}
            className="w-full bg-app-card rounded-xl p-4 border border-app-border hover:border-emerald-500/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-dm font-semibold text-text-primary text-sm">
                    Getting There
                  </h3>
                  <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="font-dm text-text-mid text-xs mt-0.5">
                  {bestRoute.name} · {bestRoute.duration} · {bestRoute.statusLabel}
                </p>
              </div>
            </div>
          </button>

          {/* Card 2: Meeting Brief */}
          <button
            onClick={() => onNavigate('meeting-brief')}
            className="w-full bg-app-card rounded-xl p-4 border border-app-border hover:border-accent/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-dm font-semibold text-text-primary text-sm">
                      Meeting Brief
                    </h3>
                    {meeting.briefReady && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 rounded text-[10px] font-dm font-medium">
                        Ready
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-accent transition-colors" />
                </div>
                <p className="font-dm text-text-mid text-xs mt-0.5">
                  {attendees.length} attendees · {brief.keyItems.length} key items · {brief.documents.length} docs
                </p>
              </div>
            </div>
          </button>

          {/* Card 3: Ask AI */}
          <button
            onClick={() => onNavigate('meeting-chatbot')}
            className="w-full bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/30 hover:border-accent/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-dm font-semibold text-text-primary text-sm">
                    Ask AI
                  </h3>
                  <ChevronRight className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
                </div>
                <p className="font-dm text-text-mid text-xs mt-0.5">
                  Get answers about this meeting
                </p>
              </div>
            </div>
          </button>

          {/* Card 4: Live Recording */}
          <button
            onClick={() => onNavigate('meeting-recording')}
            className="w-full bg-app-card rounded-xl p-4 border border-app-border hover:border-rose-500/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <Mic className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-dm font-semibold text-text-primary text-sm">
                    Live Recording
                  </h3>
                  <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-rose-500 transition-colors" />
                </div>
                <p className="font-dm text-text-mid text-xs mt-0.5">
                  Transcribe with action items
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Meeting Context Summary */}
        <div className="mt-4 p-4 bg-app-card2 rounded-xl border border-app-border">
          <h4 className="font-dm font-semibold text-text-primary text-xs mb-2 uppercase tracking-wide">
            Quick Context
          </h4>
          <p className="font-dm text-text-mid text-xs leading-relaxed">
            {brief.summary}
          </p>
        </div>
      </div>
    </div>
  )
}
