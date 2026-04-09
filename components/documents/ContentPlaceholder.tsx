'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Document } from '@/lib/types'

interface ContentPlaceholderProps {
  doc: Document
}

export function ContentPlaceholder({ doc }: ContentPlaceholderProps) {
  return (
    <div className="bg-app-card border border-app-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Source Document</SectionLabel>
        <button className="text-xs font-dm text-accent border border-accent-border rounded px-3 py-1 hover:bg-accent-dim transition-colors">
          Download Original
        </button>
      </div>
      <div className="bg-app-surface rounded p-4 space-y-2">
        <div className="h-2 bg-app-border rounded w-3/4" />
        <div className="h-2 bg-app-border rounded w-full" />
        <div className="h-2 bg-app-border rounded w-5/6" />
        <div className="h-2 bg-app-border rounded w-4/5" />
        <div className="h-2 bg-app-border rounded w-2/3" />
        <div className="h-8" />
        <div className="h-2 bg-app-border/60 rounded w-full" />
        <div className="h-2 bg-app-border/60 rounded w-3/4" />
        <div className="h-2 bg-app-border/60 rounded w-5/6" />
      </div>
      <p className="font-dm text-text-dim text-xs text-center mt-3">
        Preview available after OneDrive connection · {doc.size}
      </p>
    </div>
  )
}
