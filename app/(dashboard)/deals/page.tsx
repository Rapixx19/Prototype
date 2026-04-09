'use client'

import { useState, useSyncExternalStore, useCallback } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ProjectCard } from '@/components/deals/ProjectCard'
import { PROJECTS } from '@/lib/data'
import { getRole, canAccess } from '@/lib/auth'
import type { Role, ProjectStatus } from '@/lib/types'

const STATUS_TABS: (ProjectStatus | 'All')[] = ['All', 'Active', 'Pipeline', 'Completed', 'On Hold']

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

export default function DealsPage() {
  const role = useRole()
  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState<ProjectStatus | 'All'>('All')
  const [search, setSearch] = useState('')

  if (!mounted) return null

  // Filter projects based on role access
  let accessibleProjects = PROJECTS
  if (!canAccess(role, 'all_projects')) {
    if (canAccess(role, 'assigned_projects')) {
      // Employee sees assigned projects only (for demo, show first 3)
      accessibleProjects = PROJECTS.slice(0, 3)
    } else {
      // Intern sees nothing
      accessibleProjects = []
    }
  }

  // Apply status filter
  const statusFiltered = activeTab === 'All'
    ? accessibleProjects
    : accessibleProjects.filter(p => p.status === activeTab)

  // Apply search filter
  const filtered = statusFiltered.filter(p => {
    const q = search.toLowerCase()
    return !search ||
      p.name.toLowerCase().includes(q) ||
      p.geography.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
  })

  // Count by status
  const counts = {
    All: accessibleProjects.length,
    Active: accessibleProjects.filter(p => p.status === 'Active').length,
    Pipeline: accessibleProjects.filter(p => p.status === 'Pipeline').length,
    Completed: accessibleProjects.filter(p => p.status === 'Completed').length,
    'On Hold': accessibleProjects.filter(p => p.status === 'On Hold').length,
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <SectionLabel>Deal Room</SectionLabel>
          <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">
            Project Portfolio
          </h1>
          <p className="font-dm text-text-dim text-sm mt-1">
            {accessibleProjects.length} projects under management
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Status Tabs */}
        <div className="flex gap-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-dm rounded-lg transition-colors ${
                activeTab === tab
                  ? 'text-accent bg-accent-dim border border-accent-border'
                  : 'text-text-dim hover:text-text-mid hover:bg-app-card'
              }`}
            >
              {tab} <span className="text-xs ml-1 opacity-70">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-app-card border border-app-border rounded-lg px-4 py-2 text-text-primary font-dm text-sm placeholder:text-text-dim focus:border-accent-border focus:outline-none transition-colors w-64"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Project Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} role={role} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-dm text-text-dim text-sm">
            {search ? `No projects matching "${search}"` : 'No projects to display'}
          </p>
        </div>
      )}
    </div>
  )
}
