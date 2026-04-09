'use client'

import { Calendar, MapPin, Video } from 'lucide-react'
import { PWA_CALENDAR_WEEK, PWA_MEETINGS } from '@/lib/pwa/pwaData'

export interface CalendarScreenProps {
  onSelectMeeting: (meetingId: string) => void
}

export function CalendarScreen({ onSelectMeeting }: CalendarScreenProps) {
  const todaysMeetings = PWA_MEETINGS.filter(m => m.isToday)
  const tomorrowsMeetings = PWA_MEETINGS.filter(m => !m.isToday)

  const getMeetingIcon = (location: string) => {
    if (location.toLowerCase().includes('video') || location.toLowerCase().includes('teams')) {
      return Video
    }
    return MapPin
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="font-syne font-bold text-text-primary text-xl">Calendar</h1>
          <span className="font-dm text-text-mid text-sm">Apr 2025</span>
        </div>
      </div>

      {/* Week strip */}
      <div className="px-4 pb-4">
        <div className="bg-app-card rounded-xl p-3 border border-app-border">
          <div className="grid grid-cols-7 gap-1">
            {PWA_CALENDAR_WEEK.map(day => (
              <button
                key={day.date}
                className={`flex flex-col items-center py-2 rounded-lg transition-colors ${
                  day.isToday
                    ? 'bg-accent text-text-primary'
                    : 'hover:bg-app-card2'
                }`}
              >
                <span className={`font-dm text-[10px] mb-0.5 ${
                  day.isToday ? 'text-text-primary/80' : 'text-text-dim'
                }`}>
                  {day.dayLabel}
                </span>
                <span className={`font-dm font-semibold text-sm ${
                  day.isToday ? 'text-text-primary' : 'text-text-mid'
                }`}>
                  {day.dayNumber}
                </span>
                {day.hasEvents && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: Math.min(day.eventCount, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          day.isToday ? 'bg-text-primary/60' : 'bg-accent'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Today's meetings */}
        <div className="mb-4">
          <h2 className="font-dm font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Today — Thursday 10 April
          </h2>
          <div className="space-y-2">
            {todaysMeetings.map(meeting => {
              const IconComponent = getMeetingIcon(meeting.location)
              return (
                <button
                  key={meeting.id}
                  onClick={() => onSelectMeeting(meeting.id)}
                  className="w-full bg-app-card rounded-xl p-3 border border-app-border hover:border-accent/30 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-full min-h-[40px] rounded-full bg-accent" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-dm font-semibold text-accent text-sm">
                          {meeting.time}
                        </span>
                        {meeting.status === 'tentative' && (
                          <span className="px-1.5 py-0.5 bg-gold/20 text-gold rounded text-[10px] font-dm font-medium">
                            Tentative
                          </span>
                        )}
                      </div>
                      <h3 className="font-dm font-semibold text-text-primary text-sm truncate">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <IconComponent className="w-3 h-3 text-text-dim" />
                        <span className="font-dm text-text-dim text-xs truncate">
                          {meeting.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tomorrow's meetings */}
        {tomorrowsMeetings.length > 0 && (
          <div>
            <h2 className="font-dm font-semibold text-text-mid text-sm mb-3">
              Tomorrow — Friday 11 April
            </h2>
            <div className="space-y-2">
              {tomorrowsMeetings.map(meeting => {
                const IconComponent = getMeetingIcon(meeting.location)
                return (
                  <button
                    key={meeting.id}
                    onClick={() => onSelectMeeting(meeting.id)}
                    className="w-full bg-app-card rounded-xl p-3 border border-app-border hover:border-accent/30 transition-colors text-left opacity-80"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-full min-h-[40px] rounded-full bg-app-card2" />
                      <div className="flex-1 min-w-0">
                        <span className="font-dm font-medium text-text-mid text-sm">
                          {meeting.time}
                        </span>
                        <h3 className="font-dm font-semibold text-text-primary text-sm truncate">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <IconComponent className="w-3 h-3 text-text-dim" />
                          <span className="font-dm text-text-dim text-xs truncate">
                            {meeting.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
