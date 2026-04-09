'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Mic, Circle, CheckCircle } from 'lucide-react'
import { getPWAMeeting, PWA_TRANSCRIPT_SEGMENTS } from '@/lib/pwa/pwaData'
import type { PWATranscriptSegment } from '@/lib/pwa/pwaTypes'

export interface MeetingRecordingProps {
  meetingId: string
  onBack: () => void
}

export function MeetingRecording({ meetingId, onBack }: MeetingRecordingProps) {
  const meeting = getPWAMeeting(meetingId)
  const [visibleSegments, setVisibleSegments] = useState<PWATranscriptSegment[]>([])
  const [isRecording, setIsRecording] = useState(true)

  // Simulate live transcription
  useEffect(() => {
    if (!isRecording) return

    const showNextSegment = (index: number) => {
      if (index >= PWA_TRANSCRIPT_SEGMENTS.length) {
        setIsRecording(false)
        return
      }

      setVisibleSegments(prev => [...prev, PWA_TRANSCRIPT_SEGMENTS[index]])

      // Random delay between 2-4 seconds for each segment
      const delay = 2000 + Math.random() * 2000
      setTimeout(() => showNextSegment(index + 1), delay)
    }

    // Start with first segment after 1 second
    const timer = setTimeout(() => showNextSegment(0), 1000)
    return () => clearTimeout(timer)
  }, [isRecording])

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
        <div className="flex-1">
          <span className="font-dm font-semibold text-text-primary text-sm">Live Recording</span>
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-rose-500/20 rounded-full">
            <Circle className="w-2.5 h-2.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="font-dm text-rose-500 text-xs font-medium">Recording</span>
          </div>
        )}
      </div>

      {/* Meeting info */}
      <div className="px-4 py-3 border-b border-app-border">
        <h1 className="font-syne font-bold text-text-primary text-lg">{meeting.title}</h1>
        <p className="font-dm text-text-dim text-xs mt-0.5">
          {meeting.time} · {meeting.location}
        </p>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {visibleSegments.length === 0 && isRecording && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-accent animate-pulse" />
              <span className="font-dm text-text-dim text-sm">Listening...</span>
            </div>
          </div>
        )}

        {visibleSegments.map((segment, i) => (
          <div
            key={segment.id}
            className={`animate-fade-in ${segment.isHighlight ? 'relative' : ''}`}
          >
            {/* Highlight indicator */}
            {segment.isHighlight && (
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent rounded-full" />
            )}

            <div className={`${segment.isHighlight ? 'pl-2' : ''}`}>
              {/* Speaker and timestamp */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-dm font-semibold text-xs ${
                  segment.speaker === 'You' ? 'text-accent' : 'text-text-primary'
                }`}>
                  {segment.speaker}
                </span>
                {segment.speakerRole && (
                  <span className="font-dm text-text-dim text-[10px]">
                    {segment.speakerRole}
                  </span>
                )}
                <span className="font-dm text-text-dim text-[10px] ml-auto">
                  {segment.timestamp}
                </span>
              </div>

              {/* Content */}
              <p className={`font-dm text-sm leading-relaxed ${
                segment.isHighlight ? 'text-text-primary' : 'text-text-mid'
              }`}>
                {segment.content}
              </p>

              {/* Action item */}
              {segment.actionItem && (
                <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
                  <CheckCircle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="font-dm text-accent text-xs">{segment.actionItem}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Listening indicator at bottom */}
        {isRecording && visibleSegments.length > 0 && (
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-dm text-text-dim text-xs">Transcribing...</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-3 border-t border-app-border bg-app-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className={`w-4 h-4 ${isRecording ? 'text-accent' : 'text-text-dim'}`} />
            <span className="font-dm text-text-mid text-xs">
              {isRecording ? 'Recording in progress' : 'Recording complete'}
            </span>
          </div>
          <span className="font-dm text-text-dim text-xs">
            {visibleSegments.length} segments
          </span>
        </div>
      </div>
    </div>
  )
}
