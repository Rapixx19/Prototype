'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Clock, Users, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAllLoginHistory, getAllAuditLog } from '@/lib/auth/authService'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LoginHistoryTable } from '@/components/admin/LoginHistoryTable'
import { AuditLogTable } from '@/components/admin/AuditLogTable'
import type { LoginHistoryEntry, AuditLogEntry } from '@/lib/auth/authTypes'

type TabType = 'logins' | 'audit'

export default function AdminActivityPage() {
  const router = useRouter()
  const { isAdmin, isLoading, onlineCount } = useAuth()

  const [activeTab, setActiveTab] = useState<TabType>('logins')
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])

  useEffect(() => {
    if (!isLoading) {
      if (!isAdmin) {
        router.push('/dashboard')
      } else {
        setLoginHistory(getAllLoginHistory())
        setAuditLog(getAllAuditLog())
      }
    }
  }, [isLoading, isAdmin, router])

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const activeLogins = loginHistory.filter(h => !h.logoutAt).length
  const totalLogins = loginHistory.length

  return (
    <div className="p-4 sm:p-8 fade-in">
      {/* Header */}
      <div className="mb-6">
        <SectionLabel>Admin Panel</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-2xl sm:text-3xl mt-2">
          Activity & History
        </h1>
        <p className="font-dm text-text-mid text-sm mt-1">
          Track login activity and system changes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-green/15 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-status-green animate-pulse" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{onlineCount}</div>
              <div className="font-dm text-text-dim text-sm">Online Now</div>
            </div>
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Activity size={20} className="text-accent" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{activeLogins}</div>
              <div className="font-dm text-text-dim text-sm">Active Sessions</div>
            </div>
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-blue/15 flex items-center justify-center">
              <Clock size={20} className="text-status-blue" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{totalLogins}</div>
              <div className="font-dm text-text-dim text-sm">Total Logins</div>
            </div>
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-purple/15 flex items-center justify-center">
              <Shield size={20} className="text-status-purple" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{auditLog.length}</div>
              <div className="font-dm text-text-dim text-sm">Audit Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('logins')}
          className={`
            px-4 py-2 rounded-lg font-dm text-sm transition-colors
            ${activeTab === 'logins'
              ? 'bg-accent text-app-bg font-medium'
              : 'bg-app-card border border-app-border text-text-mid hover:border-accent-border'
            }
          `}
        >
          Login History
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`
            px-4 py-2 rounded-lg font-dm text-sm transition-colors
            ${activeTab === 'audit'
              ? 'bg-accent text-app-bg font-medium'
              : 'bg-app-card border border-app-border text-text-mid hover:border-accent-border'
            }
          `}
        >
          Audit Log
        </button>
      </div>

      {/* Content */}
      {activeTab === 'logins' ? (
        <LoginHistoryTable entries={loginHistory} />
      ) : (
        <AuditLogTable entries={auditLog} />
      )}
    </div>
  )
}
