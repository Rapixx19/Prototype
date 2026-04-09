import { CLIENT_ACCOUNTS, ClientAccount } from './clientAuth'

export interface SessionRecord {
  clientId: string
  clientName: string
  clientEmail: string
  startTime: number
  endTime: number | null
  durationSeconds: number
  date: string
  pagesVisited: string[]
}

export interface ClientStats {
  clientId: string
  clientName: string
  clientEmail: string
  avatar: string
  color: string
  totalSessions: number
  totalTimeSeconds: number
  lastVisit: string | null
  firstVisit: string | null
  sessions: SessionRecord[]
}

const SESSIONS_KEY = 'vecterai_sessions'

function getAllSessions(): SessionRecord[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(SESSIONS_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function saveSessions(sessions: SessionRecord[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function startSession(clientId: string, clientName: string, clientEmail: string): string {
  const sessionId = `session-${Date.now()}`
  const record: SessionRecord = {
    clientId,
    clientName,
    clientEmail,
    startTime: Date.now(),
    endTime: null,
    durationSeconds: 0,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    pagesVisited: [],
  }
  const all = getAllSessions()
  all.push(record)
  saveSessions(all)
  localStorage.setItem('vecterai_current_session_start', String(Date.now()))
  localStorage.setItem('vecterai_current_session_index', String(all.length - 1))
  return sessionId
}

export function trackPage(path: string): void {
  const indexRaw = localStorage.getItem('vecterai_current_session_index')
  if (indexRaw === null) return
  const index = parseInt(indexRaw)
  const all = getAllSessions()
  if (!all[index]) return
  if (!all[index].pagesVisited.includes(path)) {
    all[index].pagesVisited.push(path)
    saveSessions(all)
  }
}

export function endSession(): void {
  const indexRaw = localStorage.getItem('vecterai_current_session_index')
  const startRaw = localStorage.getItem('vecterai_current_session_start')
  if (indexRaw === null || startRaw === null) return
  const index = parseInt(indexRaw)
  const start = parseInt(startRaw)
  const all = getAllSessions()
  if (!all[index]) return
  const duration = Math.floor((Date.now() - start) / 1000)
  all[index].endTime = Date.now()
  all[index].durationSeconds = duration
  saveSessions(all)
  localStorage.removeItem('vecterai_current_session_start')
  localStorage.removeItem('vecterai_current_session_index')
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m < 60) return `${m}m ${s}s`
  const h = Math.floor(m / 60)
  const mins = m % 60
  return `${h}h ${mins}m`
}

export function getClientStats(): ClientStats[] {
  const sessions = getAllSessions()
  return CLIENT_ACCOUNTS.map((account: ClientAccount) => {
    const clientSessions = sessions.filter((s: SessionRecord) => s.clientId === account.id)
    const completed = clientSessions.filter((s: SessionRecord) => s.endTime !== null)
    const totalTime = completed.reduce((acc: number, s: SessionRecord) => acc + s.durationSeconds, 0)
    const sorted = clientSessions.sort((a: SessionRecord, b: SessionRecord) => b.startTime - a.startTime)
    return {
      clientId: account.id,
      clientName: account.name,
      clientEmail: account.email,
      avatar: account.avatar,
      color: account.color,
      totalSessions: clientSessions.length,
      totalTimeSeconds: totalTime,
      lastVisit: sorted[0]?.date ?? null,
      firstVisit: sorted[sorted.length - 1]?.date ?? null,
      sessions: sorted,
    }
  })
}
