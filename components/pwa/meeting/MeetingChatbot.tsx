'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Bot, Sparkles, Loader2 } from 'lucide-react'
import {
  getPWAMeeting,
  PWA_MEETING_BRIEF,
  getMeetingAttendees
} from '@/lib/pwa/pwaData'
import { callPWAClaude, WELCOME_MESSAGE, SUGGESTED_QUESTIONS } from '@/lib/pwa/pwaClaude'

export interface MeetingChatbotProps {
  meetingId: string
  onBack: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function MeetingChatbot({ meetingId, onBack }: MeetingChatbotProps) {
  const meeting = getPWAMeeting(meetingId)
  const brief = PWA_MEETING_BRIEF
  const attendees = meeting ? getMeetingAttendees(meeting.attendeeIds) : []

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || isLoading || !meeting) return

    setInput('')
    setShowSuggestions(false)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const context = {
        meeting,
        attendees,
        keyNumbers: brief.keyNumbers,
        keyItems: brief.keyItems,
        documents: brief.documents,
        summary: brief.summary,
      }

      const response = await callPWAClaude(
        text,
        context,
        messages.filter(m => m.role === 'user' || m.role === 'assistant')
      )

      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Unable to connect to VecterAI intelligence. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="font-dm font-semibold text-text-primary text-sm">Ask VecterAI</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-accent text-text-primary rounded-br-md'
                  : 'bg-app-card border border-app-border rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Bot className="w-3 h-3 text-accent" />
                  <span className="font-dm text-accent text-[10px] font-medium">VecterAI</span>
                </div>
              )}
              <p className="font-dm text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-app-card border border-app-border rounded-2xl rounded-bl-md px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                <span className="font-dm text-text-dim text-xs">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggested questions */}
        {showSuggestions && messages.length === 1 && (
          <div className="mt-2">
            <p className="font-dm text-text-dim text-xs mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 bg-app-card border border-app-border rounded-full font-dm text-text-mid text-xs hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {q.length > 30 ? `${q.slice(0, 30)}...` : q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-app-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about this meeting..."
            className="flex-1 bg-app-card border border-app-border rounded-xl px-4 py-2.5 font-dm text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
          >
            <Send className="w-4 h-4 text-text-primary" />
          </button>
        </div>
      </div>
    </div>
  )
}
