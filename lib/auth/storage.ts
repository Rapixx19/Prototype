export interface UserAccount {
  id: string
  username: string
  password: string
  displayName: string
  createdAt: string
  active: boolean
  createdBy?: string
}

export interface AuthSession {
  account: UserAccount
  loginTime: string
}

const ACCOUNTS_KEY = 'vecterai_accounts'
const SESSION_KEY = 'vecterai_session'
const ADMIN_KEY = 'vecterai_admin'

const ADMIN_CREDENTIALS = {
  username: 'ferdinand.straehuber@gmail.com',
  password: 'Lolotte2!',
}

const HARDCODED_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-001',
    username: 'jaime.serrano',
    displayName: 'Jaime Serrano',
    password: 'Test2026',
    createdAt: '2025-01-01T00:00:00Z',
    active: true,
    createdBy: 'admin',
  },
  {
    id: 'acc-002',
    username: 'lucie.manning',
    displayName: 'Lucie Manning',
    password: 'Test2026',
    createdAt: '2025-01-01T00:00:00Z',
    active: true,
    createdBy: 'admin',
  },
  {
    id: 'acc-003',
    username: 'ferdinand.straehuber',
    displayName: 'Ferdinand Straehuber',
    password: 'Test2026',
    createdAt: '2025-01-01T00:00:00Z',
    active: true,
    createdBy: 'admin',
  },
  {
    id: 'acc-004',
    username: 'testuser178',
    displayName: 'Testuser178',
    password: 'Test2026',
    createdAt: '2025-01-01T00:00:00Z',
    active: true,
    createdBy: 'admin',
  },
]

function getLocalAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function initStorage(): void {
  // No-op: hardcoded accounts are always available
}

export function getAllAccounts(): UserAccount[] {
  const localAccounts = getLocalAccounts()
  // Filter out any local accounts that have the same id as hardcoded ones
  const filteredLocal = localAccounts.filter(
    local => !HARDCODED_ACCOUNTS.find(h => h.id === local.id)
  )
  return [...HARDCODED_ACCOUNTS, ...filteredLocal]
}

export function saveAllAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return
  // Only save non-hardcoded accounts to localStorage
  const localOnly = accounts.filter(a => !a.id.startsWith('acc-00'))
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(localOnly))
}

export function getAccountById(id: string): UserAccount | null {
  return getAllAccounts().find(a => a.id === id) ?? null
}

export function createAccount(account: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
  const localAccounts = getLocalAccounts()
  const newAccount: UserAccount = {
    ...account,
    id: `acc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  localAccounts.push(newAccount)
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(localAccounts))
  return newAccount
}

export function deleteAccount(id: string): void {
  // Prevent deletion of hardcoded accounts
  if (id.startsWith('acc-00')) return
  const localAccounts = getLocalAccounts().filter(a => a.id !== id)
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(localAccounts))
}

export function login(username: string, password: string): { success: boolean; isAdmin: boolean; account?: UserAccount; error?: string } {
  const u = username.trim().toLowerCase()
  const p = password.trim()

  console.log('LOGIN ATTEMPT:', u)

  // Check admin
  if (u === ADMIN_CREDENTIALS.username.toLowerCase() && p === ADMIN_CREDENTIALS.password) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ isAdmin: true, loginTime: new Date().toISOString() }))
    }
    return { success: true, isAdmin: true }
  }

  // Check hardcoded accounts first — works on any device, no localStorage needed
  const hardcoded = HARDCODED_ACCOUNTS.find(
    a => a.username.toLowerCase() === u && a.password === p && a.active
  )
  if (hardcoded) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ account: hardcoded, loginTime: new Date().toISOString() }))
    }
    return { success: true, isAdmin: false, account: hardcoded }
  }

  // Then check localStorage accounts (admin-created ones)
  const local = getLocalAccounts().find(
    a => a.username.toLowerCase() === u && a.password === p && a.active
  )
  if (local) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ account: local, loginTime: new Date().toISOString() }))
    }
    return { success: true, isAdmin: false, account: local }
  }

  return { success: false, isAdmin: false, error: 'Invalid username or password.' }
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ADMIN_KEY)
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.account?.displayName) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_KEY) !== null
}

export function isAuthenticated(): boolean {
  return getSession() !== null || isAdminSession()
}
