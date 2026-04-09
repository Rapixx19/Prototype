'use client'

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { getRole, clearRole, getRoleLabel } from '@/lib/auth'
import { getClientSession, logoutClient } from '@/lib/clientAuth'
import { trackPage, endSession } from '@/lib/sessionTracker'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { AssistantWidget } from '@/components/AssistantWidget'
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const role = useRole()
  const mounted = useMounted()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Track page visits for client sessions
  useEffect(() => {
    const client = getClientSession()
    if (client && pathname) {
      trackPage(pathname)
    }
  }, [pathname])

  // End session on tab/browser close
  useEffect(() => {
    const handleUnload = () => {
      const client = getClientSession()
      if (client) endSession()
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && !localStorage.getItem('vecterai_role')) {
      router.push('/login')
    }
  }, [mounted, router])

  // Close sidebar on route change (handled by Sidebar component)
  // Close sidebar when screen becomes larger than md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    endSession()
    logoutClient()
    clearRole()
    router.push('/login')
  }

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          role={role}
          roleLabel={getRoleLabel(role)}
          onLogout={handleLogout}
          onMenuClick={handleMenuClick}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <AssistantWidget />
    </div>
  )
}
