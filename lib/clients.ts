export interface ClientAccount {
  id: string
  username: string
  password: string
  role: 'admin' | 'user'
  companyName: string
  contactName: string
  brandColor: string
  welcomeMessage: string
  logoInitials: string
  createdAt: string
  lastLogin: string | null
  active: boolean
}

export interface ActiveSession {
  accountId: string
  username: string
  role: 'admin' | 'user'
  companyName: string
  contactName: string
  brandColor: string
  welcomeMessage: string
  logoInitials: string
}

const ACCOUNTS_KEY = 'vecterai_client_accounts'
const SESSION_KEY = 'vecterai_session'

const ADMIN_DEFAULT: ClientAccount = {
  id: 'admin-001',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  companyName: 'VecterAI Consulting',
  contactName: 'Administrator',
  brandColor: '#00C8F0',
  welcomeMessage: 'Welcome back.',
  logoInitials: 'VA',
  createdAt: new Date().toISOString(),
  lastLogin: null,
  active: true,
}

export function getAccounts(): ClientAccount[] {
  if (typeof window === 'undefined') return [ADMIN_DEFAULT]
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([ADMIN_DEFAULT]))
      return [ADMIN_DEFAULT]
    }
    const parsed: ClientAccount[] = JSON.parse(raw)
    if (!parsed.find(a => a.id === 'admin-001')) parsed.unshift(ADMIN_DEFAULT)
    return parsed
  } catch {
    return [ADMIN_DEFAULT]
  }
}

export function saveAccounts(accounts: ClientAccount[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function findAccount(username: string, password: string): ClientAccount | null {
  return getAccounts().find(
    a => a.username.toLowerCase() === username.toLowerCase()
      && a.password === password
      && a.active
  ) ?? null
}

export function createAccount(data: Omit<ClientAccount, 'id' | 'createdAt' | 'lastLogin'>): void {
  const accounts = getAccounts()
  accounts.push({ ...data, id: `client-${Date.now()}`, createdAt: new Date().toISOString(), lastLogin: null })
  saveAccounts(accounts)
}

export function updateAccount(id: string, updates: Partial<ClientAccount>): void {
  const accounts = getAccounts()
  const i = accounts.findIndex(a => a.id === id)
  if (i !== -1) { accounts[i] = { ...accounts[i], ...updates }; saveAccounts(accounts) }
}

export function deleteAccount(id: string): void {
  if (id === 'admin-001') return
  saveAccounts(getAccounts().filter(a => a.id !== id))
}

export function setSession(account: ClientAccount): void {
  if (typeof window === 'undefined') return
  const session: ActiveSession = {
    accountId: account.id,
    username: account.username,
    role: account.role,
    companyName: account.companyName,
    contactName: account.contactName,
    brandColor: account.brandColor,
    welcomeMessage: account.welcomeMessage,
    logoInitials: account.logoInitials,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  // Keep existing role key — do not remove this line
  localStorage.setItem('vecterai_role', account.role === 'admin' ? 'owner' : 'employee')
}

export function getSession(): ActiveSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('vecterai_role')
}

export function recordLogin(id: string): void {
  updateAccount(id, { lastLogin: new Date().toISOString() })
}
