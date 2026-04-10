'use client'

import { PROJECTS } from '@/lib/data'
import type { DocType, DocSource } from '@/lib/types'

interface FilterBarProps {
  activeType: DocType | 'All'
  setActiveType: (type: DocType | 'All') => void
  projectId: string
  setProjectId: (id: string) => void
  source: DocSource | ''
  setSource: (source: DocSource | '') => void
  lowConfOnly: boolean
  setLowConfOnly: (val: boolean) => void
}

const DOC_TYPES: (DocType | 'All')[] = [
  'All', 'Financial', 'Legal', 'Meeting Note', 'Report', 'Correspondence', 'Contract', 'Proposal', 'Invoice'
]

const DOC_SOURCES: DocSource[] = ['OneDrive', 'Email', 'Photo Upload', 'Voice Memo', 'Manual Upload']

export function FilterBar({
  activeType,
  setActiveType,
  projectId,
  setProjectId,
  source,
  setSource,
  lowConfOnly,
  setLowConfOnly,
}: FilterBarProps) {
  return (
    <div className="mb-4 space-y-3">
      {/* Type tabs */}
      <div className="flex gap-1 flex-wrap overflow-x-auto pb-1">
        {DOC_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1.5 text-xs font-dm rounded transition-colors ${
              activeType === type
                ? 'text-accent border-b-2 border-accent bg-accent-dim'
                : 'text-text-dim hover:text-text-mid'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Second row: dropdowns + toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Project dropdown */}
        <select
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
          className="bg-app-card border border-app-border rounded px-3 py-2 text-text-mid text-sm font-dm focus:border-accent-border focus:outline-none"
        >
          <option value="">All Projects</option>
          {PROJECTS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Source dropdown */}
        <select
          value={source}
          onChange={e => setSource(e.target.value as DocSource | '')}
          className="bg-app-card border border-app-border rounded px-3 py-2 text-text-mid text-sm font-dm focus:border-accent-border focus:outline-none"
        >
          <option value="">All Sources</option>
          {DOC_SOURCES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Low confidence toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowConfOnly}
            onChange={e => setLowConfOnly(e.target.checked)}
            className="w-4 h-4 rounded border-app-border bg-app-card accent-accent"
          />
          <span className="font-dm text-text-dim text-sm">Show low confidence only</span>
        </label>
      </div>
    </div>
  )
}
