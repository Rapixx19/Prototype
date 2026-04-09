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
      className="flex items-center px-4 py-3.5 border-b border-app-border hover:bg-app-card/50 cursor-pointer transition-all duration-150"
      onClick={() => router.push(`/documents/${doc.id}`)}
    >
      {/* Left: name + metadata */}
      <div className="flex-1 min-w-0 mr-4">
        <div className="font-dm font-medium text-text-primary text-sm truncate">{doc.name}</div>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-dm text-text-dim text-xs">{project?.name}</span>
          <span className="text-app-border">·</span>
          <span className="font-dm text-text-dim text-xs">{doc.source}</span>
          <span className="text-app-border">·</span>
          <span className="font-dm text-text-dim text-xs">{doc.date}</span>
        </div>
      </div>

      {/* Right: badges + confidence */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge label={doc.type} color="blue" size="sm" />
        <div className="w-24">
          <ConfidenceBar value={doc.confidence} showLabel />
        </div>
        {doc.flagged && <span className="text-status-amber text-xs">⚑</span>}
        <ChevronRight className="w-4 h-4 text-text-dim" />
      </div>
    </div>
  )
}
