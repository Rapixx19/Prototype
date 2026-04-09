'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { DOCUMENTS, getProject } from '@/lib/data'

export function DocumentAlerts() {
  const router = useRouter()

  const recentDocs = [...DOCUMENTS]
    .sort((a, b) => b.dateRaw.getTime() - a.dateRaw.getTime())
    .slice(0, 5)

  return (
    <div>
      <SectionLabel>Recent Documents</SectionLabel>
      <div className="mt-3 bg-app-card border border-app-border rounded-lg overflow-hidden">
        {recentDocs.map((doc) => {
          const project = getProject(doc.projectId)
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-3 px-4 border-b border-app-border last:border-0 hover-row cursor-pointer transition-colors"
              onClick={() => router.push(`/documents/${doc.id}`)}
            >
              <div className="flex-1 min-w-0 mr-3">
                <div className="font-dm text-text-primary text-xs truncate">
                  {doc.name}
                </div>
                <div className="font-dm text-text-dim text-xs mt-0.5">
                  {project?.name.split(' ')[0] || 'Unknown'} &middot; {doc.source}
                </div>
              </div>
              <Badge label={doc.type} color="blue" size="sm" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
