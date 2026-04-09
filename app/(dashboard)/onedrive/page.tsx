'use client'

import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ConnectionStatus } from '@/components/onedrive/ConnectionStatus'
import { FolderTree } from '@/components/onedrive/FolderTree'
import { IngestQueue } from '@/components/onedrive/IngestQueue'
import { SyncProgress } from '@/components/onedrive/SyncProgress'
import { getRole, canAccess } from '@/lib/auth'
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

export default function OneDrivePage() {
  const role = useRole()
  const mounted = useMounted()
  const router = useRouter()

  if (!mounted) return null

  // Access guard: only owner and secretary can view onedrive page
  if (!canAccess(role, 'onedrive')) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <SectionLabel>Data Integration</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">
          OneDrive Integration
        </h1>
        <p className="font-dm text-text-dim text-sm mt-1">
          Manage document sync and ingestion pipeline
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className="mb-6">
        <div className="bg-app-card border border-app-border rounded-lg p-5 border-l-4 border-l-status-green">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Microsoft logo placeholder */}
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-syne font-bold text-text-primary text-base">
                    Microsoft OneDrive
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                    <span className="font-dm text-status-green text-xs font-semibold">
                      Connected · Syncing
                    </span>
                  </span>
                </div>
                <div className="font-dm text-text-dim text-xs mt-0.5">
                  Connected via Microsoft Graph API · Azure App Registration · OAuth 2.0
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-dm text-text-dim text-xs">Last sync</div>
              <div className="font-syne font-semibold text-text-primary text-sm">
                Today 07:14
              </div>
            </div>
          </div>

          {/* Permission scopes */}
          <div className="mt-4 pt-4 border-t border-app-border">
            <div className="font-dm text-text-dim text-xs mb-2">
              Active Permissions:
            </div>
            <div className="flex flex-wrap gap-2">
              {['Files.Read.All', 'Mail.Read', 'Calendars.Read', 'User.Read.All', 'offline_access'].map(
                (scope) => (
                  <span
                    key={scope}
                    className="font-dm text-xs text-status-green bg-status-green/10 border border-status-green/20 rounded px-2 py-0.5"
                  >
                    ✓ {scope}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Left: Connection Details + Microsoft Account (35%) */}
        <div className="col-span-4">
          <ConnectionStatus role={role} />
        </div>

        {/* Centre: Folder Tree (40%) */}
        <div className="col-span-5">
          <FolderTree />
        </div>

        {/* Right: Live Ingestion Queue (25%) */}
        <div className="col-span-3">
          <IngestQueue />
        </div>
      </div>

      {/* Sync Statistics + Recent Files */}
      <SyncProgress />
    </div>
  )
}
