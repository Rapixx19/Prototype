'use client'

import { ArrowLeft, Send, MoreHorizontal } from 'lucide-react'
import { getPWAThread, getThreadMessages } from '@/lib/pwa/pwaData'
import { MessageBubble } from './chat/MessageBubble'

export interface ChatConversationProps {
  threadId: string
  onBack: () => void
}

export function ChatConversation({ threadId, onBack }: ChatConversationProps) {
  const thread = getPWAThread(threadId)
  const messages = getThreadMessages(threadId)

  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="font-dm text-text-dim text-sm">Conversation not found</p>
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

        {/* Contact info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-dm font-semibold text-text-primary text-sm truncate">
            {thread.name}
          </h2>
          {thread.projectId && (
            <p className="font-dm text-text-dim text-xs">
              Project conversation
            </p>
          )}
        </div>

        <button className="w-8 h-8 rounded-full bg-app-card flex items-center justify-center hover:bg-app-card2 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-text-mid" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender === 'user'}
          />
        ))}
      </div>

      {/* Input (visual only) */}
      <div className="p-4 border-t border-app-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-app-card border border-app-border rounded-xl px-4 py-2.5 font-dm text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 transition-colors"
            readOnly
          />
          <button
            className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <Send className="w-4 h-4 text-text-primary" />
          </button>
        </div>
      </div>
    </div>
  )
}
