'use client'

import { useRouter } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { getContact, getSharedContacts, getDocTypeBreakdown } from '@/lib/data'
import type { Project } from '@/lib/types'

interface CrossConnectionsProps {
  project: Project
}

export function CrossConnections({ project }: CrossConnectionsProps) {
  const router = useRouter()
  const sharedContacts = getSharedContacts(project)
  const docBreakdown = getDocTypeBreakdown(project.documentIds)

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5 mb-4">
      <SectionLabel>Cross-Connections</SectionLabel>
      <div className="mt-3 space-y-4">
        {/* Connected contacts */}
        <div>
          <div className="font-dm text-text-dim text-xs mb-2">
            {project.contactIds.length} contacts appear across {project.documentIds.length} documents in this deal
          </div>
          <div className="flex flex-wrap gap-2">
            {project.contactIds.map(id => {
              const c = getContact(id)
              return c ? (
                <span
                  key={id}
                  className="text-xs font-dm text-accent bg-accent-dim border border-accent-border rounded px-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => router.push(`/contacts/${id}`)}
                >
                  {c.name}
                </span>
              ) : null
            })}
          </div>
        </div>

        {/* Shared contacts with other projects */}
        {sharedContacts.length > 0 && (
          <div>
            <div className="font-dm text-text-dim text-xs mb-2">
              Contacts shared with other active projects:
            </div>
            <div className="space-y-1">
              {sharedContacts.map(({ contact, sharedProjects }) => (
                <div key={contact.id} className="flex items-center gap-2 text-xs font-dm text-text-mid flex-wrap">
                  <span className="text-accent">↔</span>
                  <span>{contact.name}</span>
                  <span className="text-text-dim">also in</span>
                  {sharedProjects.map((p, i) => (
                    <span key={p.id}>
                      <span
                        className="text-gold cursor-pointer hover:underline"
                        onClick={() => router.push(`/deals/${p.id}`)}
                      >
                        {p.name}
                      </span>
                      {i < sharedProjects.length - 1 && <span className="text-text-dim">, </span>}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document types breakdown */}
        <div>
          <div className="font-dm text-text-dim text-xs mb-2">Document breakdown:</div>
          <div className="flex flex-wrap gap-2">
            {docBreakdown.map(({ type, count }) => (
              <span
                key={type}
                className="text-xs font-dm text-text-mid bg-app-border/40 rounded px-2 py-0.5"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
