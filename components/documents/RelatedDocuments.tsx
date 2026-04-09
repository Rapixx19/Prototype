'use client'

import { useRouter } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { getDocument } from '@/lib/data'
import type { Document } from '@/lib/types'

interface RelatedDocumentsProps {
  doc: Document
}

export function RelatedDocuments({ doc }: RelatedDocumentsProps) {
  const router = useRouter()

  if (doc.relatedDocIds.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <SectionLabel>Related Documents — {doc.relatedDocIds.length} in same project</SectionLabel>
      <div className="flex gap-3 overflow-x-auto pb-2 mt-3">
        {doc.relatedDocIds.slice(0, 6).map(relId => {
          const relDoc = getDocument(relId)
          if (!relDoc) return null
          return (
            <div
              key={relId}
              className="flex-shrink-0 w-56 bg-app-card border border-app-border rounded-lg p-4 hover-card cursor-pointer transition-all duration-200"
              onClick={() => router.push(`/documents/${relId}`)}
            >
              <Badge label={relDoc.type} color="blue" size="sm" />
              <p className="font-dm text-text-primary text-xs mt-2 line-clamp-2">{relDoc.name}</p>
              <p className="font-dm text-text-dim text-xs mt-1">{relDoc.date}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
