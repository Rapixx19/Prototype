'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { getDocument } from '@/lib/data'
import type { Project, DocType } from '@/lib/types'

interface DocumentTimelineProps {
  project: Project
}

const DOC_TABS: (DocType | 'All')[] = ['All', 'Financial', 'Legal', 'Meeting Note', 'Report', 'Correspondence']
const INITIAL_COUNT = 10

function confidenceDot(value: number): string {
  if (value >= 0.9) return 'bg-status-green'
  if (value >= 0.8) return 'bg-status-amber'
  return 'bg-status-red'
}

export function DocumentTimeline({ project }: DocumentTimelineProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<DocType | 'All'>('All')
  const [showAll, setShowAll] = useState(false)

  const documents = project.documentIds
    .map(id => getDocument(id))
    .filter(Boolean)
    .sort((a, b) => b!.dateRaw.getTime() - a!.dateRaw.getTime())

  const filtered = activeTab === 'All'
    ? documents
    : documents.filter(d => d!.type === activeTab)

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5">
      <SectionLabel>Document Timeline — {documents.length} documents</SectionLabel>

      {/* Type filter tabs */}
      <div className="flex gap-1 mt-3 mb-4 flex-wrap">
        {DOC_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setShowAll(false) }}
            className={`px-3 py-1.5 text-xs font-dm rounded transition-colors ${
              activeTab === tab
                ? 'text-accent bg-accent-dim border border-accent-border'
                : 'text-text-dim hover:text-text-mid'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-0">
        {displayed.map(doc => {
          if (!doc) return null
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-3 border-b border-app-border last:border-0 hover:opacity-80 cursor-pointer transition-opacity"
              onClick={() => router.push(`/documents/${doc.id}`)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                <Badge label={doc.type} color="blue" size="sm" />
                <span className="font-dm text-text-primary text-sm truncate">{doc.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-dm text-text-dim text-xs">{doc.date}</span>
                <span className="font-dm text-text-dim text-xs">{doc.source}</span>
                <div className={`w-2 h-2 rounded-full ${confidenceDot(doc.confidence)}`} title={`${Math.round(doc.confidence * 100)}%`} />
                <ChevronRight className="w-4 h-4 text-text-dim" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Show all button */}
      {!showAll && filtered.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-2 text-sm font-dm text-accent hover:text-accent/80 transition-colors"
        >
          Show all {filtered.length} documents
        </button>
      )}
    </div>
  )
}
