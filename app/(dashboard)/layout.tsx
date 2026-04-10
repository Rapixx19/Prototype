'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout, initStorage } from '@/lib/auth/storage'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { AssistantWidget } from '@/components/AssistantWidget'
import type { AuthSession } from '@/lib/auth/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    initStorage()
    const currentSession = getSession()
    if (!currentSession?.account) {
      router.push('/login')
      return
    }
    setSession(currentSession)
  }, [router])

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
    logout()
    router.push('/login')
  }

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  if (!mounted || !session) return null

  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          displayName={session.account.displayName}
          onLogout={handleLogout}
          onMenuClick={handleMenuClick}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <AssistantWidget />
    </div>
  )
}
