'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, X, SendHorizontal } from 'lucide-react'
import { askAssistant } from '@/lib/claude'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'How many documents are indexed?',
  'What are the active projects?',
  'Who is James Hartley?',
  'What are the high priority insights?',
]

export function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi, I'm the VecterAI assistant. Ask me anything about your projects, contacts, documents, or how the system works.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDot, setShowDot] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }))
      const response = await askAssistant(text.trim(), history)
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Something went wrong — please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage(input)
    }
  }

  const handleButtonClick = () => {
    setOpen(prev => !prev)
    setShowDot(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleButtonClick}
        className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-full bg-accent flex items-center justify-center cursor-pointer"
        style={{ boxShadow: '0 0 0 8px rgba(0,200,240,0.08)' }}
      >
        {/* Pulse ring when closed */}
        {!open && (
          <div className="absolute inset-0 rounded-full border-2 border-accent opacity-30 animate-ping" />
        )}

        {/* Bot icon when closed */}
        <Bot
          className={`w-6 h-6 text-app-bg absolute transition-all duration-200 ${
            open ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
        />

        {/* X icon when open */}
        <X
          className={`w-5 h-5 text-app-bg absolute transition-all duration-200 ${
            open ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        />

        {/* Red notification dot */}
        {showDot && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-status-red border-2 border-app-bg" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-[340px] h-[460px] max-h-[70vh] bg-app-card border border-app-border rounded-2xl overflow-hidden border-t-2 border-t-accent flex flex-col transition-all duration-300 ease-out ${
          open
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        {open && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-app-border bg-app-surface">
              <div className="w-8 h-8 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center">
                <span className="font-syne font-bold text-accent text-[10px]">VA</span>
              </div>
              <div className="flex-1">
                <div className="font-dm font-semibold text-text-primary text-sm">
                  VecterAI Assistant
                </div>
                <div className="font-dm text-text-dim text-[10px]">Ask me anything</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row gap-2'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center flex-shrink-0">
                      <span className="font-syne font-bold text-accent text-[8px]">VA</span>
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 max-w-[85%] font-dm text-[12px] ${
                      message.role === 'user'
                        ? 'bg-accent text-app-bg rounded-2xl rounded-tr-sm'
                        : 'bg-app-surface border border-app-border text-text-mid rounded-2xl rounded-tl-sm leading-relaxed'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Loading state */}
              {loading && (
                <div className="flex flex-row gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center flex-shrink-0">
                    <span className="font-syne font-bold text-accent text-[8px]">VA</span>
                  </div>
                  <div className="bg-app-surface border border-app-border rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-text-dim animate-bounce"
                      style={{ animationDelay: '0s' }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-text-dim animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-text-dim animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                {SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="font-dm text-[10px] text-accent bg-accent-dim border border-accent-border rounded-full px-2.5 py-1 cursor-pointer hover:bg-accent/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-app-border">
              <div className="flex items-center gap-2 bg-app-surface border border-app-border rounded-full px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent font-dm text-text-primary text-[12px] placeholder:text-text-dim focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className={`w-7 h-7 rounded-full flex items-center justify-center bg-accent ${
                    !input.trim() || loading ? 'opacity-40' : ''
                  }`}
                >
                  <SendHorizontal className="w-3.5 h-3.5 text-app-bg" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
