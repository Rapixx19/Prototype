export interface UserAccount {
  id: string
  username: string
  password: string
  displayName: string
  createdAt: string
  active: boolean
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

const SEED_ACCOUNT: UserAccount = {
  id: 'acc-demo-001',
  username: 'demo',
  password: 'demo2025',
  displayName: 'Demo User',
  createdAt: new Date().toISOString(),
  active: true,
}

export function initStorage(): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(ACCOUNTS_KEY)
  if (!raw) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([SEED_ACCOUNT]))
  }
}

export function getAllAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) {
      initStorage()
      return [SEED_ACCOUNT]
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveAllAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function getAccountById(id: string): UserAccount | null {
  return getAllAccounts().find(a => a.id === id) ?? null
}

export function createAccount(account: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
  const accounts = getAllAccounts()
  const newAccount: UserAccount = {
    ...account,
    id: `acc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  accounts.push(newAccount)
  saveAllAccounts(accounts)
  return newAccount
}

export function deleteAccount(id: string): void {
  const accounts = getAllAccounts().filter(a => a.id !== id)
  saveAllAccounts(accounts)
}

export function login(username: string, password: string): { success: boolean; isAdmin: boolean } {
  if (
    username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  ) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ loginTime: new Date().toISOString() }))
    }
    return { success: true, isAdmin: true }
  }

  const account = getAllAccounts().find(
    a => a.username.toLowerCase() === username.toLowerCase() && a.password === password && a.active
  )

  if (account) {
    const session: AuthSession = {
      account,
      loginTime: new Date().toISOString(),
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
    return { success: true, isAdmin: false }
  }

  return { success: false, isAdmin: false }
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
