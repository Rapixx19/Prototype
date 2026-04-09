'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Mic, Circle, CheckCircle, Share2, Download, Users, ListChecks, MessageSquare } from 'lucide-react'
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

      {/* Transcript - Live Recording */}
      {isRecording && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {visibleSegments.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-accent animate-pulse" />
                <span className="font-dm text-text-dim text-sm">Listening...</span>
              </div>
            </div>
          )}

          {visibleSegments.map((segment) => (
            <div
              key={segment.id}
              className={`animate-fade-in ${segment.isHighlight ? 'relative' : ''}`}
            >
              {segment.isHighlight && (
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent rounded-full" />
              )}

              <div className={`${segment.isHighlight ? 'pl-2' : ''}`}>
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

                <p className={`font-dm text-sm leading-relaxed ${
                  segment.isHighlight ? 'text-text-primary' : 'text-text-mid'
                }`}>
                  {segment.content}
                </p>

                {segment.actionItem && (
                  <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
                    <CheckCircle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="font-dm text-accent text-xs">{segment.actionItem}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {visibleSegments.length > 0 && (
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
      )}

      {/* Complete State - Branded VecterAI Document */}
      {!isRecording && (
        <div className="flex-1 overflow-y-auto p-3">
          <div className="bg-app-card rounded-xl border border-app-border overflow-hidden">
            {/* Letterhead */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-syne font-bold text-text-primary text-sm tracking-widest">
                    VECTERAI
                  </h2>
                  <p className="font-dm text-text-dim text-[8px] tracking-wide mt-0.5">
                    KNOWLEDGE OS · INTELLIGENCE DOCUMENT
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-dm text-text-dim text-[8px]">DOC-2025-0410-HG-001</p>
                  <span className="inline-block px-1.5 py-0.5 bg-gold/20 text-gold text-[7px] font-dm font-medium rounded mt-0.5">
                    CONFIDENTIAL
                  </span>
                </div>
              </div>
              <div className="h-[1px] bg-gold/40 w-full" />
            </div>

            {/* Classification strip */}
            <div className="px-4 py-1.5 bg-gold/5 border-y border-gold/10">
              <p className="font-dm text-text-dim text-[7px] text-center tracking-wide">
                MEETING NOTE · {meeting.title.toUpperCase()} · AUTO-GENERATED FROM VOICE RECORDING · 10 APR 2025
              </p>
            </div>

            {/* Document content */}
            <div className="px-4 py-3 space-y-4">
              {/* Attendees */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3 h-3 text-accent" />
                  <h3 className="font-dm font-semibold text-text-primary text-xs">Attendees</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['James Hartley', 'Sophie Renard', 'David Okonkwo', 'You'].map((name) => (
                    <span key={name} className="px-2 py-0.5 bg-app-card2 rounded text-text-mid text-[10px] font-dm">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Decisions */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ListChecks className="w-3 h-3 text-accent" />
                  <h3 className="font-dm font-semibold text-text-primary text-xs">Key Decisions</h3>
                </div>
                <ul className="space-y-1">
                  <li className="font-dm text-text-mid text-[10px] flex items-start gap-1.5">
                    <span className="text-accent mt-0.5">•</span>
                    IRR target confirmed at 18%
                  </li>
                  <li className="font-dm text-text-mid text-[10px] flex items-start gap-1.5">
                    <span className="text-accent mt-0.5">•</span>
                    Planning consent on track for 6-8 weeks
                  </li>
                </ul>
              </div>

              {/* Action Items */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-3 h-3 text-accent" />
                  <h3 className="font-dm font-semibold text-text-primary text-xs">Action Items</h3>
                </div>
                <div className="space-y-1.5">
                  {visibleSegments.filter(s => s.actionItem).map((segment) => (
                    <div key={segment.id} className="flex items-start gap-2 px-2 py-1.5 bg-accent/5 rounded border border-accent/10">
                      <CheckCircle className="w-2.5 h-2.5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-dm text-text-mid text-[10px]">{segment.actionItem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transcript preview */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-3 h-3 text-accent" />
                  <h3 className="font-dm font-semibold text-text-primary text-xs">Full Transcript</h3>
                  <span className="font-dm text-text-dim text-[9px]">({visibleSegments.length} segments)</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1.5 px-2 py-1.5 bg-app-card2/50 rounded">
                  {visibleSegments.slice(0, 3).map((segment) => (
                    <p key={segment.id} className="font-dm text-text-dim text-[9px]">
                      <span className="text-text-mid font-medium">{segment.speaker}:</span> {segment.content.slice(0, 60)}...
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Document footer */}
            <div className="px-4 py-2 border-t border-app-border">
              <div className="h-[1px] bg-gold/30 w-full mb-2" />
              <div className="flex items-center justify-between text-[7px] font-dm text-text-dim">
                <span>Generated by VecterAI Knowledge OS</span>
                <span>19 Berkeley Street · London</span>
                <span>vecterai.io</span>
              </div>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-app-card border border-app-border rounded-xl hover:bg-app-card2 transition-colors">
              <Download className="w-3.5 h-3.5 text-text-mid" />
              <span className="font-dm text-text-mid text-xs">Export PDF</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-accent rounded-xl hover:bg-accent/90 transition-colors">
              <Share2 className="w-3.5 h-3.5 text-text-primary" />
              <span className="font-dm text-text-primary text-xs font-medium">Share</span>
            </button>
          </div>
        </div>
      )}

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
