export interface ClientAccount {
  id: string
  name: string
  email: string
  password: string
  company: string
  avatar: string
  color: string
  role: 'client'
}

export const CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    id: 'client-01',
    name: 'Jaime Serrano',
    email: 'jaime.serrano@vecterai.io',
    password: 'vecterai2025',
    company: 'VecterAI Consulting',
    avatar: 'JS',
    color: '#00C8F0',
    role: 'client',
  },
  {
    id: 'client-02',
    name: 'Rafael Serrano',
    email: 'rafael.serrano@vecterai.io',
    password: 'vecterai2025',
    company: 'VecterAI Consulting',
    avatar: 'RS',
    color: '#C4A35A',
    role: 'client',
  },
  {
    id: 'client-03',
    name: 'Ferdinand Straehuber',
    email: 'ferdinand.straehuber@vecterai.io',
    password: 'vecterai2025',
    company: 'VecterAI Consulting',
    avatar: 'FS',
    color: '#00D68F',
    role: 'client',
  },
]

const CLIENT_SESSION_KEY = 'vecterai_client'

export function loginClient(email: string, password: string): ClientAccount | null {
  const account = CLIENT_ACCOUNTS.find(
    c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  )
  if (!account) return null
  localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify({ id: account.id, name: account.name, email: account.email }))
  return account
}

export function getClientSession(): { id: string; name: string; email: string } | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(CLIENT_SESSION_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function logoutClient(): void {
  localStorage.removeItem(CLIENT_SESSION_KEY)
}

export function isClientLoggedIn(): boolean {
  return getClientSession() !== null
}
