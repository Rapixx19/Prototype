'use client'

import type { PWAMessage } from '@/lib/pwa/pwaTypes'
import { FileText, Bot } from 'lucide-react'

export interface MessageBubbleProps {
  message: PWAMessage
  isCurrentUser: boolean
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const isAI = message.sender === 'ai'

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isCurrentUser
            ? 'bg-accent text-text-primary rounded-br-md'
            : 'bg-app-card border border-app-border rounded-bl-md'
        }`}
      >
        {/* AI label */}
        {isAI && (
          <div className="flex items-center gap-1.5 mb-1">
            <Bot className="w-3 h-3 text-accent" />
            <span className="font-dm text-accent text-[10px] font-medium">VecterAI</span>
          </div>
        )}

        {/* Message content */}
        <p className="font-dm text-sm leading-relaxed">
          {message.content}
        </p>

        {/* Attachment */}
        {message.attachment && (
          <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 bg-app-bg/50 rounded-lg">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span className="font-dm text-xs text-text-mid truncate">
              {message.attachment.name}
            </span>
          </div>
        )}

        {/* Time */}
        <p className={`font-dm text-[10px] mt-1 ${
          isCurrentUser ? 'text-text-primary/60' : 'text-text-dim'
        }`}>
          {message.time}
        </p>
      </div>
    </div>
  )
}
