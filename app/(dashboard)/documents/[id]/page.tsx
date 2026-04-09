'use client'

import { use, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { AISummary } from '@/components/documents/AISummary'
import { ContentPlaceholder } from '@/components/documents/ContentPlaceholder'
import { LinkedProject } from '@/components/documents/LinkedProject'
import { LinkedContacts } from '@/components/documents/LinkedContacts'
import { RelatedDocuments } from '@/components/documents/RelatedDocuments'
import { getDocument, getProject } from '@/lib/data'
import { getRole } from '@/lib/auth'
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

export default function DocumentDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  useRole() // Keep role hook for consistency
  const mounted = useMounted()

  const doc = getDocument(id)
  const project = doc ? getProject(doc.projectId) : null

  if (!mounted) return null

  if (!doc) {
    router.push('/documents')
    return null
  }

  return (
    <div className="p-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/documents')}
        className="text-accent text-sm font-dm mb-4 flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Documents
      </button>

      {/* Document Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-6">
            <h1 className="font-syne font-bold text-text-primary text-2xl leading-tight">
              {doc.name}
            </h1>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge label={doc.type} color="blue" />
              <Badge label={doc.source} color="dim" />
              <span className="font-dm text-text-dim text-sm">{doc.date}</span>
              <span className="font-dm text-text-dim text-sm">{doc.size}</span>
              {doc.flagged && <Badge label="Review Required" color="amber" />}
            </div>
          </div>
          <div className="w-32">
            <ConfidenceBar value={doc.confidence} showLabel />
          </div>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: AI Summary + Content Placeholder (60%) */}
        <div className="col-span-7">
          <AISummary doc={doc} />
          <ContentPlaceholder doc={doc} />
        </div>

        {/* Right: Cross-connections panel (40%) */}
        <div className="col-span-5">
          {project && <LinkedProject project={project} />}
          <LinkedContacts doc={doc} />
        </div>
      </div>

      {/* Related Documents — horizontal scroll */}
      <RelatedDocuments doc={doc} />
    </div>
  )
}
