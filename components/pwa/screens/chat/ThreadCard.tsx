'use client'

import type { PWAThread } from '@/lib/pwa/pwaTypes'
import { Bot } from 'lucide-react'

export interface ThreadCardProps {
  thread: PWAThread
  onTap: () => void
}

export function ThreadCard({ thread, onTap }: ThreadCardProps) {
  const isAI = thread.id === 'thread-04'

  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 p-3 bg-app-card rounded-xl border border-app-border hover:border-accent/30 transition-colors text-left"
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI
            ? 'bg-gradient-to-br from-accent to-accent/60'
            : 'bg-app-card2 border border-app-border'
        }`}
      >
        {isAI ? (
          <Bot className="w-5 h-5 text-text-primary" />
        ) : (
          <span className="font-dm font-semibold text-text-primary text-sm">
            {thread.avatar}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-dm font-semibold text-sm truncate ${
            thread.unread > 0 ? 'text-text-primary' : 'text-text-mid'
          }`}>
            {thread.name}
          </span>
          <span className="font-dm text-text-dim text-xs flex-shrink-0 ml-2">
            {thread.time}
          </span>
        </div>
        <p className={`font-dm text-xs truncate ${
          thread.unread > 0 ? 'text-text-mid' : 'text-text-dim'
        }`}>
          {thread.lastMessage}
        </p>
      </div>

      {/* Unread badge */}
      {thread.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <span className="font-dm font-semibold text-text-primary text-[10px]">
            {thread.unread}
          </span>
        </div>
      )}
    </button>
  )
}
