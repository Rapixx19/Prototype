'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { getProject } from '@/lib/data'
import type { Document } from '@/lib/types'

interface DocumentRowProps {
  doc: Document
}

export function DocumentRow({ doc }: DocumentRowProps) {
  const router = useRouter()
  const project = getProject(doc.projectId)

  return (
    <div
      className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0 px-4 py-3.5 border-b border-app-border hover:bg-app-card/50 cursor-pointer transition-all duration-150"
      onClick={() => router.push(`/documents/${doc.id}`)}
    >
      {/* Left: name + metadata */}
      <div className="flex-1 min-w-0 md:mr-4">
        <div className="font-dm font-medium text-text-primary text-sm md:truncate">{doc.name}</div>
        <div className="flex items-center gap-3 mt-1 hidden md:flex">
          <span className="font-dm text-text-dim text-xs">{project?.name}</span>
          <span className="text-app-border">·</span>
          <span className="font-dm text-text-dim text-xs">{doc.source}</span>
          <span className="text-app-border">·</span>
          <span className="font-dm text-text-dim text-xs">{doc.date}</span>
        </div>
        <div className="text-xs text-text-dim flex flex-wrap gap-1 mt-1 md:hidden">
          <span>{project?.name}</span>
          <span>·</span>
          <span>{doc.source}</span>
          <span>·</span>
          <span>{doc.date}</span>
        </div>
      </div>

      {/* Right: badges + confidence */}
      <div className="flex items-center gap-3 flex-shrink-0 mt-1 md:mt-0">
        <Badge label={doc.type} color="blue" size="sm" />
        <div className="w-24">
          <ConfidenceBar value={doc.confidence} showLabel />
        </div>
        {doc.flagged && <span className="text-status-amber text-xs">⚑</span>}
        <ChevronRight className="w-4 h-4 text-text-dim hidden md:block" />
      </div>
    </div>
  )
}
