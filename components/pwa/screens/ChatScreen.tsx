'use client'

import { Search } from 'lucide-react'
import { PWA_THREADS } from '@/lib/pwa/pwaData'
import { ThreadCard } from './chat/ThreadCard'

export interface ChatScreenProps {
  onSelectThread: (threadId: string) => void
}

export function ChatScreen({ onSelectThread }: ChatScreenProps) {
  // Sort threads: unread first, then by time
  const sortedThreads = [...PWA_THREADS].sort((a, b) => {
    if (a.unread > 0 && b.unread === 0) return -1
    if (a.unread === 0 && b.unread > 0) return 1
    return 0
  })

  const unreadCount = PWA_THREADS.reduce((sum, t) => sum + t.unread, 0)

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-syne font-bold text-text-primary text-xl">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full font-dm text-xs font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Search bar (visual only) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-app-card border border-app-border rounded-xl pl-10 pr-4 py-2.5 font-dm text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 transition-colors"
            readOnly
          />
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {sortedThreads.map(thread => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onTap={() => onSelectThread(thread.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
