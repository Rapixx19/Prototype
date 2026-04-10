'use client'

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { Monitor, Clock, Calendar, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { getClientStats, formatDuration } from '@/lib/sessionTracker'
import type { ClientStats, SessionRecord } from '@/lib/sessionTracker'
import { getRole } from '@/lib/auth'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Role } from '@/lib/types'

function useRole() {
  const subscribe = useCallback(() => () => {}, [])
  const getSnapshot = useCallback(() => getRole(), [])
  const getServerSnapshot = useCallback(() => 'owner' as Role, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function useMounted() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    onStoreChange()
    return () => {}
  }, [])
  const getSnapshot = useCallback(() => true, [])
  const getServerSnapshot = useCallback(() => false, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function cleanPath(path: string): string {
  const cleaned = path.replace(/^\//, '')
  if (!cleaned) return 'Dashboard'
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

export default function ClientAnalyticsPage() {
  const router = useRouter()
  const role = useRole()
  const mounted = useMounted()
  const [stats, setStats] = useState<ClientStats[]>([])
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (mounted && role !== 'owner') {
      router.push('/dashboard')
      return
    }
    if (mounted) {
      setStats(getClientStats())
    }
  }, [mounted, role, router])

  const handleCopy = async (clientId: string) => {
    const url = `${window.location.origin}/client-login`
    await navigator.clipboard.writeText(url)
    setCopiedId(clientId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!mounted) return null

  const totalSessions = stats.reduce((acc, s) => acc + s.totalSessions, 0)
  const totalTime = stats.reduce((acc, s) => acc + s.totalTimeSeconds, 0)

  return (
    <div className="p-4 sm:p-8">
      <SectionLabel>Client Analytics</SectionLabel>
      <h1 className="font-syne font-bold text-text-primary text-2xl sm:text-3xl mt-2">
        Client Visit Tracking
      </h1>
      <p className="font-dm text-text-mid text-sm mt-1">
        Session data stored locally · Resets if browser data is cleared
      </p>

      {/* Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="font-syne font-bold text-text-primary text-3xl">{stats.length}</div>
          <div className="font-dm text-text-dim text-sm">Total Clients</div>
        </div>
        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="font-syne font-bold text-text-primary text-3xl">{totalSessions}</div>
          <div className="font-dm text-text-dim text-sm">Total Sessions</div>
        </div>
        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="font-syne font-bold text-text-primary text-3xl">
            {formatDuration(totalTime)}
          </div>
          <div className="font-dm text-text-dim text-sm">Total Time</div>
        </div>
      </div>

      {/* Client cards */}
      <div className="space-y-4 mt-6">
        {stats.map(client => (
          <div
            key={client.clientId}
            className="bg-app-card border border-app-border rounded-xl overflow-hidden"
            style={{ borderTopColor: client.color, borderTopWidth: '2px' }}
          >
            {/* Header */}
            <div
              onClick={() =>
                setExpandedClient(expandedClient === client.clientId ? null : client.clientId)
              }
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-app-surface/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full font-syne font-bold text-sm flex items-center justify-center"
                  style={{
                    backgroundColor: `${client.color}20`,
                    color: client.color,
                  }}
                >
                  {client.avatar}
                </div>
                <div>
                  <div className="font-syne font-bold text-text-primary text-base">
                    {client.clientName}
                  </div>
                  <div className="font-dm text-text-dim text-sm">{client.clientEmail}</div>
                </div>
              </div>

              {client.totalSessions > 0 ? (
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-text-primary">
                      <Monitor className="w-4 h-4 text-text-dim" />
                      <span className="font-syne font-bold text-lg">{client.totalSessions}</span>
                    </div>
                    <span className="font-dm text-text-dim text-xs">Sessions</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-text-primary">
                      <Clock className="w-4 h-4 text-text-dim" />
                      <span className="font-syne font-bold text-lg">
                        {formatDuration(client.totalTimeSeconds)}
                      </span>
                    </div>
                    <span className="font-dm text-text-dim text-xs">Total Time</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-text-primary">
                      <Calendar className="w-4 h-4 text-text-dim" />
                      <span className="font-syne font-bold text-lg">{client.lastVisit}</span>
                    </div>
                    <span className="font-dm text-text-dim text-xs">Last Visit</span>
                  </div>
                  {expandedClient === client.clientId ? (
                    <ChevronUp className="w-5 h-5 text-text-dim" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-dim" />
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="font-dm text-text-dim text-sm">No visits recorded yet</span>
                  {expandedClient === client.clientId ? (
                    <ChevronUp className="w-5 h-5 text-text-dim" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-dim" />
                  )}
                </div>
              )}
            </div>

            {/* Expanded session list */}
            {expandedClient === client.clientId && (
              <div className="bg-app-surface border-t border-app-border">
                {client.sessions.length > 0 ? (
                  <>
                    {/* Table header */}
                    <div className="px-5 py-3 grid grid-cols-5 gap-4 border-b border-app-border">
                      <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                        Date
                      </span>
                      <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                        Duration
                      </span>
                      <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                        Pages Visited
                      </span>
                      <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                        Started
                      </span>
                      <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                        Status
                      </span>
                    </div>

                    {/* Session rows */}
                    {client.sessions.map((session: SessionRecord, i: number) => (
                      <div
                        key={i}
                        className="px-5 py-3 grid grid-cols-5 gap-4 border-t border-app-border first:border-t-0"
                      >
                        <span className="font-dm text-text-primary text-sm">{session.date}</span>
                        <span
                          className={`font-dm text-sm ${
                            session.endTime === null ? 'text-accent animate-pulse' : 'text-text-primary'
                          }`}
                        >
                          {session.endTime === null
                            ? 'In progress'
                            : formatDuration(session.durationSeconds)}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {session.pagesVisited.map((page, j) => (
                            <span
                              key={j}
                              className="font-dm text-[10px] text-text-dim bg-app-card border border-app-border rounded px-1.5 py-0.5"
                            >
                              {cleanPath(page)}
                            </span>
                          ))}
                        </div>
                        <span className="font-dm text-text-dim text-xs">
                          {new Date(session.startTime).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>
                          {session.endTime !== null ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-dm bg-status-green/20 text-status-green">
                              Complete
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-dm bg-accent/20 text-accent animate-pulse">
                              Active
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-5 py-8 text-center font-dm text-text-dim text-sm">
                    No sessions recorded yet. Share the client login link to begin tracking.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share link section */}
      <div className="bg-app-card border border-app-border rounded-xl p-5 mt-6">
        <div className="font-dm text-[10px] font-bold text-gold tracking-widest uppercase mb-4">
          Client Login Links
        </div>
        <div className="space-y-3">
          {stats.map(client => (
            <div
              key={client.clientId}
              className="flex items-center justify-between p-3 bg-app-surface rounded-lg border border-app-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full font-syne font-bold text-xs flex items-center justify-center"
                  style={{
                    backgroundColor: `${client.color}20`,
                    color: client.color,
                  }}
                >
                  {client.avatar}
                </div>
                <div>
                  <div className="font-dm text-text-primary text-sm">{client.clientName}</div>
                  <div className="font-dm text-text-dim text-xs">{client.clientEmail}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(client.clientId)}
                className="flex items-center gap-2 px-3 py-1.5 bg-app-card border border-app-border rounded-lg hover:border-accent-border transition-colors"
              >
                {copiedId === client.clientId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-status-green" />
                    <span className="font-dm text-status-green text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-text-dim" />
                    <span className="font-dm text-text-dim text-xs">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-app-surface rounded-lg border border-app-border">
          <div className="font-dm text-text-dim text-xs">
            Login URL:{' '}
            <span className="text-accent font-mono">
              {typeof window !== 'undefined' ? `${window.location.origin}/client-login` : '/client-login'}
            </span>
          </div>
          <div className="font-dm text-text-dim text-xs mt-1">
            Password for all clients: <span className="text-text-primary font-mono">vecterai2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}
