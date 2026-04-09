'use client'

import { use, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ProjectHeader } from '@/components/deals/ProjectHeader'
import { ProjectSynthesis } from '@/components/deals/ProjectSynthesis'
import { StatsBar } from '@/components/deals/StatsBar'
import { FinancialSnapshot } from '@/components/deals/FinancialSnapshot'
import { DocumentTimeline } from '@/components/deals/DocumentTimeline'
import { PeopleInvolved } from '@/components/deals/PeopleInvolved'
import { CrossConnections } from '@/components/deals/CrossConnections'
import { ProjectInsights } from '@/components/deals/ProjectInsights'
import { getProject } from '@/lib/data'
import { getRole, canAccess } from '@/lib/auth'
import type { Role } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

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

export default function DealDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const role = useRole()
  const mounted = useMounted()

  const project = getProject(id)

  if (!mounted) return null

  if (!project) {
    router.push('/deals')
    return null
  }

  return (
    <div className="p-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/deals')}
        className="text-accent text-sm font-dm mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Deal Room
      </button>

      {/* Project Header */}
      <ProjectHeader project={project} />

      {/* Risk Alert */}
      {project.riskFlag && (
        <div className="mb-6 flex items-start gap-3 bg-red-950/20 border border-red-900/30 rounded-lg p-4">
          <span className="text-status-red text-lg mt-0.5">⚠</span>
          <div>
            <div className="font-dm font-semibold text-status-red text-sm">Active Risk Flag</div>
            <p className="font-dm text-status-red text-sm leading-relaxed mt-1">{project.riskFlag}</p>
          </div>
        </div>
      )}

      {/* AI Synthesis Card */}
      <ProjectSynthesis project={project} />

      {/* Stats Bar */}
      <StatsBar project={project} role={role} />

      {/* Financial Snapshot - Owner only */}
      {canAccess(role, 'financial') && (
        <FinancialSnapshot project={project} />
      )}

      {/* 3-column grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Document Timeline (60%) */}
        <div className="col-span-7">
          <DocumentTimeline project={project} />
        </div>

        {/* Right: People + Cross-connections + Insights (40%) */}
        <div className="col-span-5 space-y-4">
          <PeopleInvolved project={project} />
          <CrossConnections project={project} />
          <ProjectInsights project={project} role={role} />
        </div>
      </div>
    </div>
  )
}
