'use client'

import { useState } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'

interface FolderNode {
  name: string
  docs: number
  synced: boolean
  children: FolderNode[]
}

const FOLDER_TREE: FolderNode[] = [
  {
    name: 'VecterAI — Knowledge Base',
    docs: 500,
    synced: true,
    children: [
      {
        name: 'Active Deals',
        docs: 189,
        synced: true,
        children: [
          { name: 'Harbour Gate Portfolio', docs: 62, synced: true, children: [] },
          { name: 'Nordic Hospitality Venture', docs: 48, synced: true, children: [] },
          { name: 'Alpine Heritage Collection', docs: 54, synced: true, children: [] },
          { name: 'Mediterranean Mixed-Use', docs: 44, synced: true, children: [] },
          { name: 'Urban Regeneration Fund', docs: 38, synced: true, children: [] },
        ],
      },
      {
        name: 'Pipeline',
        docs: 71,
        synced: true,
        children: [
          { name: 'Central European Logistics', docs: 31, synced: true, children: [] },
          { name: 'Atlantic Residential', docs: 22, synced: true, children: [] },
          { name: 'Northern Energy Transition', docs: 18, synced: true, children: [] },
        ],
      },
      {
        name: 'Completed',
        docs: 71,
        synced: true,
        children: [
          { name: 'Continental Office Fund', docs: 71, synced: true, children: [] },
        ],
      },
      {
        name: 'On Hold',
        docs: 28,
        synced: true,
        children: [
          { name: 'Coastal Leisure Assets', docs: 28, synced: true, children: [] },
        ],
      },
      { name: 'Contacts & Relationships', docs: 0, synced: true, children: [] },
      { name: 'Team Documents', docs: 0, synced: true, children: [] },
    ],
  },
]

interface FolderRowProps {
  folder: FolderNode
  depth: number
  expanded: Set<string>
  onToggle: (name: string) => void
}

function FolderRow({ folder, depth, expanded, onToggle }: FolderRowProps) {
  const isExpanded = expanded.has(folder.name)
  const hasChildren = folder.children.length > 0

  return (
    <>
      <div
        className="flex items-center gap-2 py-1.5 hover:bg-app-surface rounded px-2 -mx-2 cursor-pointer transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && onToggle(folder.name)}
      >
        {/* Expand/collapse arrow */}
        {hasChildren ? (
          <span className="w-4 h-4 flex items-center justify-center text-text-dim">
            {isExpanded ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}

        {/* Folder icon */}
        <span className="text-sm">📁</span>

        {/* Folder name */}
        <span className="font-dm text-text-primary text-sm flex-1 truncate">
          {folder.name}
        </span>

        {/* Doc count badge */}
        {folder.docs > 0 && (
          <span className="font-dm text-xs text-text-dim bg-app-border/50 px-1.5 py-0.5 rounded">
            {folder.docs}
          </span>
        )}

        {/* Synced indicator */}
        <span className="font-dm text-xs text-status-green">✓ Synced</span>
      </div>

      {/* Children */}
      {isExpanded &&
        folder.children.map((child) => (
          <FolderRow
            key={child.name}
            folder={child}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
          />
        ))}
    </>
  )
}

export function FolderTree() {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['VecterAI — Knowledge Base', 'Active Deals'])
  )

  const toggleFolder = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5">
      <div className="mb-4">
        <SectionLabel>Synced Folders</SectionLabel>
      </div>
      <div className="space-y-0">
        {FOLDER_TREE.map((folder) => (
          <FolderRow
            key={folder.name}
            folder={folder}
            depth={0}
            expanded={expanded}
            onToggle={toggleFolder}
          />
        ))}
      </div>
    </div>
  )
}
