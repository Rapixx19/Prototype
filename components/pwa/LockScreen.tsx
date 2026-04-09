'use client'

import { Calendar, ChevronUp } from 'lucide-react'
import { PWA_NOTIFICATIONS, getPWAMeeting } from '@/lib/pwa/pwaData'

export interface LockScreenProps {
  showNotification: boolean
  onNotificationTap: () => void
  onUnlock: () => void
}

export function LockScreen({ showNotification, onNotificationTap, onUnlock }: LockScreenProps) {
  // Get the meeting notification (first one)
  const meetingNotification = PWA_NOTIFICATIONS[0]
  const meeting = meetingNotification.meetingId ? getPWAMeeting(meetingNotification.meetingId) : null

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-app-surface to-app-bg relative">
      {/* Date and Time */}
      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        <p className="font-dm text-lg text-text-mid mb-1">
          Thursday, 10 April
        </p>
        <h1 className="font-syne font-bold text-7xl text-white tracking-tight">
          08:30
        </h1>
      </div>

      {/* Notification Area */}
      <div className="flex-1 px-4 pt-8">
        {showNotification && (
          <button
            onClick={onNotificationTap}
            className="w-full animate-slide-in-up"
          >
            <div className="bg-app-card/90 backdrop-blur-xl rounded-2xl p-4 border-l-4 border-l-accent shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-dm font-semibold text-text-primary text-sm">
                      {meetingNotification.title}
                    </span>
                    <span className="font-dm text-text-dim text-xs">
                      {meetingNotification.time}
                    </span>
                  </div>
                  <p className="font-dm text-text-mid text-xs leading-relaxed">
                    {meetingNotification.body}
                  </p>
                  {meeting && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gold/20 text-gold rounded text-[10px] font-dm font-medium">
                        Leave by {meeting.leaveBy}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Swipe to Unlock */}
      <button
        onClick={onUnlock}
        className="pb-4 flex flex-col items-center gap-2 cursor-pointer group"
      >
        <ChevronUp className="w-6 h-6 text-text-dim group-hover:text-text-mid animate-bounce" />
        <span className="font-dm text-text-dim text-sm group-hover:text-text-mid transition-colors">
          Swipe up to unlock
        </span>
      </button>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
