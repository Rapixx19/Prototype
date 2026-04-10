'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { TeamUser, Session, LoginCredentials, CreateUserInput, UpdateUserInput } from '@/lib/auth/authTypes'
import { initializeData } from '@/lib/auth/authData'
import {
  authenticate,
  logout as authLogout,
  getCurrentSession,
  getCurrentUser,
  isAuthenticated as checkAuthenticated,
  isAdmin as checkAdmin,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getOnlineUsersCount,
  logPasswordView,
} from '@/lib/auth/authService'

interface AuthContextValue {
  user: TeamUser | null
  session: Session | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => void
  // Admin functions
  users: TeamUser[]
  onlineCount: number
  addUser: (input: CreateUserInput) => Promise<{ success: boolean; error?: string }>
  editUser: (userId: string, input: UpdateUserInput) => Promise<{ success: boolean; error?: string }>
  removeUser: (userId: string) => Promise<{ success: boolean; error?: string }>
  refreshUsers: () => void
  logPasswordsViewed: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TeamUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<TeamUser[]>([])
  const [onlineCount, setOnlineCount] = useState(0)

  // Initialize auth state on mount
  useEffect(() => {
    initializeData()
    const currentSession = getCurrentSession()
    const currentUser = getCurrentUser()

    setSession(currentSession)
    setUser(currentUser)
    setIsAuthenticated(checkAuthenticated())
    setIsAdmin(checkAdmin())
    setUsers(getAllUsers())
    setOnlineCount(getOnlineUsersCount())
    setIsLoading(false)
  }, [])

  const refreshUser = useCallback(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsAdmin(checkAdmin())
  }, [])

  const refreshUsers = useCallback(() => {
    setUsers(getAllUsers())
    setOnlineCount(getOnlineUsersCount())
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = authenticate(credentials)

    if (result.success && result.user && result.session) {
      setUser(result.user)
      setSession(result.session)
      setIsAuthenticated(true)
      setIsAdmin(result.user.role === 'admin')
      refreshUsers()
      return { success: true }
    }

    return { success: false, error: result.error }
  }, [refreshUsers])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
    setSession(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    refreshUsers()
  }, [refreshUsers])

  const addUser = useCallback(async (input: CreateUserInput) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    if (!isAdmin) return { success: false, error: 'Admin access required' }

    const result = createUser(input, user.id)
    if (result.success) {
      refreshUsers()
    }
    return { success: result.success, error: result.error }
  }, [user, isAdmin, refreshUsers])

  const editUser = useCallback(async (userId: string, input: UpdateUserInput) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    if (!isAdmin) return { success: false, error: 'Admin access required' }

    const result = updateUser(userId, input, user.id)
    if (result.success) {
      refreshUsers()
      // If editing self, refresh current user
      if (userId === user.id) {
        refreshUser()
      }
    }
    return { success: result.success, error: result.error }
  }, [user, isAdmin, refreshUsers, refreshUser])

  const removeUser = useCallback(async (userId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    if (!isAdmin) return { success: false, error: 'Admin access required' }

    const result = deleteUser(userId, user.id)
    if (result.success) {
      refreshUsers()
    }
    return { success: result.success, error: result.error }
  }, [user, isAdmin, refreshUsers])

  const logPasswordsViewed = useCallback(() => {
    if (user) {
      logPasswordView(user.id)
    }
  }, [user])

  const value: AuthContextValue = {
    user,
    session,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
    refreshUser,
    users,
    onlineCount,
    addUser,
    editUser,
    removeUser,
    refreshUsers,
    logPasswordsViewed,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  return { isAuthenticated, isLoading }
}

export function useRequireAdmin() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth()
  return { isAdmin, isLoading, isAuthenticated }
}
