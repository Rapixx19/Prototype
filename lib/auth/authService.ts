// Authentication business logic for the VecterAI prototype
import type {
  TeamUser,
  Session,
  LoginCredentials,
  CreateUserInput,
  UpdateUserInput,
  LoginHistoryEntry,
  AuditLogEntry,
} from './authTypes'
import {
  getUsers,
  getUserByUsername,
  getUserById,
  saveUsers,
  getStoredSession,
  saveSession,
  clearSession,
  addLoginHistoryEntry,
  updateLoginHistoryEntry,
  addAuditLogEntry,
  getLoginHistory,
  getAuditLog,
  generateId,
  getInitials,
  calculateDuration,
} from './authData'

interface AuthResult {
  success: boolean
  error?: string
  user?: TeamUser
  session?: Session
}

interface UserOperationResult {
  success: boolean
  error?: string
  user?: TeamUser
}

// Store current session history ID for logout tracking
let currentHistoryId: string | null = null

// Authenticate user
export function authenticate(credentials: LoginCredentials): AuthResult {
  const { username, password } = credentials

  if (!username || !password) {
    return { success: false, error: 'Username and password are required' }
  }

  const user = getUserByUsername(username)

  if (!user) {
    return { success: false, error: 'Invalid username or password' }
  }

  if (user.password !== password) {
    return { success: false, error: 'Invalid username or password' }
  }

  if (user.status === 'suspended') {
    return { success: false, error: 'This account has been suspended' }
  }

  if (user.status === 'inactive') {
    return { success: false, error: 'This account is inactive' }
  }

  // Create session
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

  const session: Session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    role: user.role,
    loginAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  saveSession(session)

  // Update user's last login and online status
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === user.id)
  if (userIndex !== -1) {
    users[userIndex].lastLoginAt = now.toISOString()
    users[userIndex].onlineStatus = 'online'
    saveUsers(users)
  }

  // Add login history entry
  const historyId = generateId('hist')
  currentHistoryId = historyId
  addLoginHistoryEntry({
    id: historyId,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    loginAt: now.toISOString(),
    logoutAt: null,
    duration: null,
    device: detectDevice(),
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
  })

  // Add audit log entry
  addAuditLogEntry({
    id: generateId('audit'),
    userId: user.id,
    username: user.username,
    action: 'login',
    details: 'User logged in',
    timestamp: now.toISOString(),
  })

  return { success: true, user, session }
}

// Logout user
export function logout(): void {
  const session = getStoredSession()

  if (session) {
    // Update user's online status
    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === session.userId)
    if (userIndex !== -1) {
      users[userIndex].onlineStatus = 'offline'
      saveUsers(users)
    }

    // Update login history with logout time
    if (currentHistoryId) {
      const now = new Date().toISOString()
      const history = getLoginHistory()
      const entry = history.find(h => h.id === currentHistoryId)
      if (entry) {
        updateLoginHistoryEntry(currentHistoryId, {
          logoutAt: now,
          duration: calculateDuration(entry.loginAt, now),
        })
      }
      currentHistoryId = null
    }

    // Add audit log entry
    addAuditLogEntry({
      id: generateId('audit'),
      userId: session.userId,
      username: session.username,
      action: 'logout',
      details: 'User logged out',
      timestamp: new Date().toISOString(),
    })
  }

  clearSession()
}

// Get current session
export function getCurrentSession(): Session | null {
  return getStoredSession()
}

// Get current user
export function getCurrentUser(): TeamUser | null {
  const session = getStoredSession()
  if (!session) return null
  return getUserById(session.userId)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getStoredSession() !== null
}

// Check if current user is admin
export function isAdmin(): boolean {
  const session = getStoredSession()
  return session?.role === 'admin'
}

// Create new user (admin only)
export function createUser(input: CreateUserInput, creatorId: string): UserOperationResult {
  const { username, password, email, displayName, role } = input

  // Validation
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' }
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid email is required' }
  }

  if (!displayName || displayName.length < 2) {
    return { success: false, error: 'Display name is required' }
  }

  // Check if username already exists
  const existingUser = getUserByUsername(username)
  if (existingUser) {
    return { success: false, error: 'Username already exists' }
  }

  const users = getUsers()
  const creator = getUserById(creatorId)
  const now = new Date().toISOString()

  const newUser: TeamUser = {
    id: generateId('user'),
    username: username.toLowerCase(),
    password,
    email,
    displayName,
    avatar: getInitials(displayName),
    role,
    status: 'active',
    lastLoginAt: null,
    onlineStatus: 'offline',
    createdAt: now,
    createdBy: creatorId,
  }

  users.push(newUser)
  saveUsers(users)

  // Add audit log entry
  addAuditLogEntry({
    id: generateId('audit'),
    userId: creatorId,
    username: creator?.username || 'unknown',
    action: 'create_user',
    targetUserId: newUser.id,
    targetUsername: newUser.username,
    details: `Created user account for ${displayName}`,
    timestamp: now,
  })

  return { success: true, user: newUser }
}

// Update user (admin only)
export function updateUser(userId: string, input: UpdateUserInput, updaterId: string): UserOperationResult {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }

  const user = users[userIndex]
  const updater = getUserById(updaterId)

  // Apply updates
  if (input.displayName !== undefined) {
    user.displayName = input.displayName
    user.avatar = getInitials(input.displayName)
  }
  if (input.email !== undefined) {
    user.email = input.email
  }
  if (input.password !== undefined && input.password.length >= 6) {
    user.password = input.password
  }
  if (input.role !== undefined) {
    user.role = input.role
  }
  if (input.status !== undefined) {
    user.status = input.status
  }

  users[userIndex] = user
  saveUsers(users)

  // Add audit log entry
  addAuditLogEntry({
    id: generateId('audit'),
    userId: updaterId,
    username: updater?.username || 'unknown',
    action: 'update_user',
    targetUserId: user.id,
    targetUsername: user.username,
    details: `Updated user account for ${user.displayName}`,
    timestamp: new Date().toISOString(),
  })

  return { success: true, user }
}

// Delete user (admin only)
export function deleteUser(userId: string, deleterId: string): UserOperationResult {
  // Cannot delete yourself
  if (userId === deleterId) {
    return { success: false, error: 'Cannot delete your own account' }
  }

  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }

  const user = users[userIndex]
  const deleter = getUserById(deleterId)

  // Remove user
  users.splice(userIndex, 1)
  saveUsers(users)

  // Add audit log entry
  addAuditLogEntry({
    id: generateId('audit'),
    userId: deleterId,
    username: deleter?.username || 'unknown',
    action: 'delete_user',
    targetUserId: user.id,
    targetUsername: user.username,
    details: `Deleted user account for ${user.displayName}`,
    timestamp: new Date().toISOString(),
  })

  return { success: true }
}

// Get all users (for admin panel)
export function getAllUsers(): TeamUser[] {
  return getUsers()
}

// Get online users count
export function getOnlineUsersCount(): number {
  const users = getUsers()
  return users.filter(u => u.onlineStatus === 'online').length
}

// Log password view action
export function logPasswordView(viewerId: string): void {
  const viewer = getUserById(viewerId)
  addAuditLogEntry({
    id: generateId('audit'),
    userId: viewerId,
    username: viewer?.username || 'unknown',
    action: 'view_passwords',
    details: 'Viewed user passwords in admin panel',
    timestamp: new Date().toISOString(),
  })
}

// Get all login history
export function getAllLoginHistory(): LoginHistoryEntry[] {
  return getLoginHistory()
}

// Get all audit log entries
export function getAllAuditLog(): AuditLogEntry[] {
  return getAuditLog()
}

// Helper: Detect device from user agent
function detectDevice(): string {
  if (typeof window === 'undefined') return 'Unknown'

  const ua = navigator.userAgent
  let browser = 'Unknown'
  let os = 'Unknown'

  // Detect browser
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'

  // Detect OS
  if (ua.includes('Mac OS')) os = 'MacOS'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Android')) os = 'Android'

  return `${browser} on ${os}`
}
