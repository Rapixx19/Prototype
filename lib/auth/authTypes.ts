// Team authentication types for the VecterAI prototype

export type TeamRole = 'admin' | 'member' | 'viewer'
export type UserStatus = 'active' | 'inactive' | 'suspended'
export type OnlineStatus = 'online' | 'offline' | 'away'

export interface TeamUser {
  id: string
  username: string
  password: string
  email: string
  displayName: string
  avatar: string
  role: TeamRole
  status: UserStatus
  lastLoginAt: string | null
  onlineStatus: OnlineStatus
  createdAt: string
  createdBy: string
}

export interface Session {
  userId: string
  username: string
  displayName: string
  avatar: string
  role: TeamRole
  loginAt: string
  expiresAt: string
}

export interface LoginHistoryEntry {
  id: string
  userId: string
  username: string
  displayName: string
  loginAt: string
  logoutAt: string | null
  duration: string | null
  device: string
  ipAddress: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  username: string
  action: 'login' | 'logout' | 'create_user' | 'update_user' | 'delete_user' | 'view_passwords'
  targetUserId?: string
  targetUsername?: string
  details: string
  timestamp: string
}

export interface AuthState {
  user: TeamUser | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface CreateUserInput {
  username: string
  password: string
  email: string
  displayName: string
  role: TeamRole
}

export interface UpdateUserInput {
  displayName?: string
  email?: string
  password?: string
  role?: TeamRole
  status?: UserStatus
}
