// Mock user data and storage for the VecterAI prototype
import type { TeamUser, LoginHistoryEntry, AuditLogEntry, Session } from './authTypes'

const STORAGE_KEYS = {
  USERS: 'vecterai_team_users',
  SESSION: 'vecterai_team_session',
  LOGIN_HISTORY: 'vecterai_login_history',
  AUDIT_LOG: 'vecterai_audit_log',
} as const

// Initial mock users
const INITIAL_USERS: TeamUser[] = [
  {
    id: 'user-001',
    username: 'fstraehuber',
    password: 'admin123',
    email: 'ferdinand.straehuber@gmail.com',
    displayName: 'Ferdinand Straehuber',
    avatar: 'FS',
    role: 'admin',
    status: 'active',
    lastLoginAt: null,
    onlineStatus: 'offline',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'user-006',
    username: 'admin',
    password: 'admin123',
    email: 'admin@vecterai.io',
    displayName: 'System Administrator',
    avatar: 'SA',
    role: 'admin',
    status: 'active',
    lastLoginAt: null,
    onlineStatus: 'offline',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'user-002',
    username: 'jthompson',
    password: 'portfolio2025',
    email: 'james.thompson@vecterai.io',
    displayName: 'James Thompson',
    avatar: 'JT',
    role: 'admin',
    status: 'active',
    lastLoginAt: '2025-04-08T09:30:00Z',
    onlineStatus: 'offline',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'user-003',
    username: 'smorris',
    password: 'deals2025',
    email: 'sarah.morris@vecterai.io',
    displayName: 'Sarah Morris',
    avatar: 'SM',
    role: 'member',
    status: 'active',
    lastLoginAt: '2025-04-09T14:15:00Z',
    onlineStatus: 'offline',
    createdAt: '2024-02-01T08:00:00Z',
    createdBy: 'user-002',
  },
  {
    id: 'user-004',
    username: 'rchen',
    password: 'analyst2025',
    email: 'robert.chen@vecterai.io',
    displayName: 'Robert Chen',
    avatar: 'RC',
    role: 'member',
    status: 'active',
    lastLoginAt: '2025-04-09T08:45:00Z',
    onlineStatus: 'offline',
    createdAt: '2024-03-10T09:30:00Z',
    createdBy: 'user-002',
  },
  {
    id: 'user-005',
    username: 'viewer',
    password: 'view2025',
    email: 'viewer@vecterai.io',
    displayName: 'Demo Viewer',
    avatar: 'DV',
    role: 'viewer',
    status: 'active',
    lastLoginAt: null,
    onlineStatus: 'offline',
    createdAt: '2024-04-01T12:00:00Z',
    createdBy: 'user-001',
  },
]

// Initial login history
const INITIAL_LOGIN_HISTORY: LoginHistoryEntry[] = [
  {
    id: 'hist-001',
    userId: 'user-002',
    username: 'jthompson',
    displayName: 'James Thompson',
    loginAt: '2025-04-08T09:30:00Z',
    logoutAt: '2025-04-08T18:45:00Z',
    duration: '9h 15m',
    device: 'Chrome on MacOS',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'hist-002',
    userId: 'user-003',
    username: 'smorris',
    displayName: 'Sarah Morris',
    loginAt: '2025-04-09T14:15:00Z',
    logoutAt: '2025-04-09T17:30:00Z',
    duration: '3h 15m',
    device: 'Safari on MacOS',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'hist-003',
    userId: 'user-004',
    username: 'rchen',
    displayName: 'Robert Chen',
    loginAt: '2025-04-09T08:45:00Z',
    logoutAt: '2025-04-09T12:00:00Z',
    duration: '3h 15m',
    device: 'Chrome on Windows',
    ipAddress: '192.168.1.110',
  },
]

// Initial audit log
const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-001',
    userId: 'user-001',
    username: 'admin',
    action: 'create_user',
    targetUserId: 'user-002',
    targetUsername: 'jthompson',
    details: 'Created user account for James Thompson',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    id: 'audit-002',
    userId: 'user-002',
    username: 'jthompson',
    action: 'create_user',
    targetUserId: 'user-003',
    targetUsername: 'smorris',
    details: 'Created user account for Sarah Morris',
    timestamp: '2024-02-01T08:00:00Z',
  },
  {
    id: 'audit-003',
    userId: 'user-002',
    username: 'jthompson',
    action: 'login',
    details: 'User logged in',
    timestamp: '2025-04-08T09:30:00Z',
  },
]

// Storage helpers
function isClient(): boolean {
  return typeof window !== 'undefined'
}

export function initializeData(): void {
  if (!isClient()) return

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(INITIAL_LOGIN_HISTORY))
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(INITIAL_AUDIT_LOG))
  }
}

// User operations
export function getUsers(): TeamUser[] {
  if (!isClient()) return INITIAL_USERS
  initializeData()
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : INITIAL_USERS
}

export function getUserById(id: string): TeamUser | null {
  const users = getUsers()
  return users.find(u => u.id === id) || null
}

export function getUserByUsername(username: string): TeamUser | null {
  const users = getUsers()
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

export function saveUsers(users: TeamUser[]): void {
  if (!isClient()) return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

// Session operations
export function getStoredSession(): Session | null {
  if (!isClient()) return null
  const data = localStorage.getItem(STORAGE_KEYS.SESSION)
  if (!data) return null

  const session: Session = JSON.parse(data)
  // Check if session is expired
  if (new Date(session.expiresAt) < new Date()) {
    clearSession()
    return null
  }
  return session
}

export function saveSession(session: Session): void {
  if (!isClient()) return
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
}

export function clearSession(): void {
  if (!isClient()) return
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}

// Login history operations
export function getLoginHistory(): LoginHistoryEntry[] {
  if (!isClient()) return INITIAL_LOGIN_HISTORY
  initializeData()
  const data = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY)
  return data ? JSON.parse(data) : INITIAL_LOGIN_HISTORY
}

export function addLoginHistoryEntry(entry: LoginHistoryEntry): void {
  if (!isClient()) return
  const history = getLoginHistory()
  history.unshift(entry)
  localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(history.slice(0, 100)))
}

export function updateLoginHistoryEntry(id: string, updates: Partial<LoginHistoryEntry>): void {
  if (!isClient()) return
  const history = getLoginHistory()
  const index = history.findIndex(h => h.id === id)
  if (index !== -1) {
    history[index] = { ...history[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(history))
  }
}

// Audit log operations
export function getAuditLog(): AuditLogEntry[] {
  if (!isClient()) return INITIAL_AUDIT_LOG
  initializeData()
  const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
  return data ? JSON.parse(data) : INITIAL_AUDIT_LOG
}

export function addAuditLogEntry(entry: AuditLogEntry): void {
  if (!isClient()) return
  const log = getAuditLog()
  log.unshift(entry)
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(log.slice(0, 500)))
}

// Generate unique IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Generate initials from name
export function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Format date for display
export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Calculate duration between two dates
export function calculateDuration(start: string, end: string | null): string {
  if (!end) return 'Active'
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate.getTime() - startDate.getTime()

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// Get role display label
export function getRoleDisplayLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrator',
    member: 'Team Member',
    viewer: 'Viewer',
  }
  return labels[role] || role
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#00D68F',
    inactive: '#6B7280',
    suspended: '#EF4444',
  }
  return colors[status] || '#6B7280'
}

// Get online status color
export function getOnlineStatusColor(status: string): string {
  const colors: Record<string, string> = {
    online: '#00D68F',
    offline: '#6B7280',
    away: '#F5A623',
  }
  return colors[status] || '#6B7280'
}

// Reset all data to initial state
export function resetAllData(): void {
  if (!isClient()) return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS))
  localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(INITIAL_LOGIN_HISTORY))
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(INITIAL_AUDIT_LOG))
  clearSession()
}
