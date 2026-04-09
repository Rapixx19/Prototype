'use client'

import { useCallback } from 'react'
import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TeamGrid } from '@/components/team/TeamGrid'
import { ActivityFeed } from '@/components/team/ActivityFeed'
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

export default function TeamPage() {
  const role = useRole()
  const mounted = useMounted()
  const router = useRouter()

  if (!mounted) return null

  // Access guard: only owner and secretary can view team page
  if (!canAccess(role, 'team_partial')) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <SectionLabel>Team Management</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">
          Team Overview
        </h1>
        <p className="font-dm text-text-dim text-sm mt-1">
          Monitor team activity and performance
        </p>
      </div>

      {/* Team Grid — 4 columns */}
      <TeamGrid role={role} />

      {/* Activity Feed — Full width */}
      <ActivityFeed />
    </div>
  )
}
