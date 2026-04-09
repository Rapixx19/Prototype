'use client'

import { useState, useSyncExternalStore, useCallback } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SearchBar } from '@/components/documents/SearchBar'
import { FilterBar } from '@/components/documents/FilterBar'
import { DocumentRow } from '@/components/documents/DocumentRow'
import { DOCUMENTS, getProject } from '@/lib/data'
import { getRole, canAccess } from '@/lib/auth'
import type { Role, DocType, DocSource, Document } from '@/lib/types'

const PER_PAGE = 25

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

function filterDocuments(
  docs: Document[],
  query: string,
  type: DocType | 'All',
  projectId: string,
  source: DocSource | '',
  lowConfOnly: boolean
): Document[] {
  return docs.filter(doc => {
    const q = query.toLowerCase()
    const matchQuery = !query ||
      doc.name.toLowerCase().includes(q) ||
      doc.type.toLowerCase().includes(q) ||
      (getProject(doc.projectId)?.name ?? '').toLowerCase().includes(q) ||
      doc.tags.some(t => t.toLowerCase().includes(q))
    const matchType = type === 'All' || doc.type === type
    const matchProject = !projectId || doc.projectId === projectId
    const matchSource = !source || doc.source === source
    const matchConf = !lowConfOnly || doc.confidence < 0.82
    return matchQuery && matchType && matchProject && matchSource && matchConf
  })
}

export default function DocumentsPage() {
  const role = useRole()
  const mounted = useMounted()
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState<DocType | 'All'>('All')
  const [projectId, setProjectId] = useState('')
  const [source, setSource] = useState<DocSource | ''>('')
  const [lowConfOnly, setLowConfOnly] = useState(false)
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<'recent' | 'alpha' | 'project' | 'confidence'>('recent')

  if (!mounted) return null

  // Filter based on role access
  let accessibleDocs = DOCUMENTS
  if (!canAccess(role, 'all_documents')) {
    // For demo: intern sees only a few, employee sees project docs
    if (role === 'intern') {
      accessibleDocs = DOCUMENTS.slice(0, 10)
    } else if (role === 'employee') {
      accessibleDocs = DOCUMENTS.slice(0, 100)
    }
  }

  // Apply filters
  const filtered = filterDocuments(accessibleDocs, query, activeType, projectId, source, lowConfOnly)

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'alpha':
        return a.name.localeCompare(b.name)
      case 'project':
        return (getProject(a.projectId)?.name ?? '').localeCompare(getProject(b.projectId)?.name ?? '')
      case 'confidence':
        return b.confidence - a.confidence
      case 'recent':
      default:
        return b.dateRaw.getTime() - a.dateRaw.getTime()
    }
  })

  // Paginate
  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const pagedDocs = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const handleQueryChange = (q: string) => {
    setQuery(q)
    setPage(0)
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <SectionLabel>Document Library</SectionLabel>
          <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">
            Knowledge Base
          </h1>
          <p className="font-dm text-text-dim text-sm mt-1">
            {accessibleDocs.length} documents indexed
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar query={query} setQuery={handleQueryChange} onClear={() => setPage(0)} />

      {/* Filter Bar */}
      <FilterBar
        activeType={activeType}
        setActiveType={(t) => { setActiveType(t); setPage(0) }}
        projectId={projectId}
        setProjectId={(p) => { setProjectId(p); setPage(0) }}
        source={source}
        setSource={(s) => { setSource(s); setPage(0) }}
        lowConfOnly={lowConfOnly}
        setLowConfOnly={(v) => { setLowConfOnly(v); setPage(0) }}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="font-dm text-text-dim text-sm">
          {sorted.length} document{sorted.length !== 1 ? 's' : ''} found
          {query && ` for "${query}"`}
        </span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="text-xs font-dm text-text-dim bg-transparent border-none focus:outline-none cursor-pointer"
        >
          <option value="recent">Most recent</option>
          <option value="alpha">Alphabetical</option>
          <option value="project">By project</option>
          <option value="confidence">By confidence</option>
        </select>
      </div>

      {/* Document List */}
      <div className="bg-app-card border border-app-border rounded-lg overflow-hidden">
        {pagedDocs.length > 0 ? (
          pagedDocs.map(doc => <DocumentRow key={doc.id} doc={doc} />)
        ) : (
          <div className="py-16 text-center">
            <p className="font-dm text-text-dim text-sm">
              {query ? `No documents matching "${query}"` : 'No documents to display'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-dm text-text-mid border border-app-border rounded hover:bg-app-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="font-dm text-text-dim text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm font-dm text-text-mid border border-app-border rounded hover:bg-app-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
