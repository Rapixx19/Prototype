'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { getContact } from '@/lib/data'
import type { Document, Strength } from '@/lib/types'

interface LinkedContactsProps {
  doc: Document
}

function strengthColor(strength: Strength): 'green' | 'blue' | 'amber' | 'dim' {
  const colors: Record<Strength, 'green' | 'blue' | 'amber' | 'dim'> = {
    Strong: 'green', Active: 'blue', Dormant: 'amber', Cold: 'dim'
  }
  return colors[strength] ?? 'dim'
}

export function LinkedContacts({ doc }: LinkedContactsProps) {
  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5 mb-4">
      <SectionLabel>Contacts Mentioned — {doc.contactIds.length} found</SectionLabel>
      <div className="mt-3">
        {doc.contactIds.map(contactId => {
          const contact = getContact(contactId)
          if (!contact) return null
          return (
            <div
              key={contactId}
              className="flex items-center justify-between py-2.5 border-b border-app-border last:border-0"
            >
              <div>
                <div className="font-dm font-medium text-text-primary text-sm">{contact.name}</div>
                <div className="font-dm text-text-dim text-xs">
                  {contact.role} · {contact.company}
                </div>
              </div>
              <Badge label={contact.strength} color={strengthColor(contact.strength)} size="sm" />
            </div>
          )
        })}
        {doc.contactIds.length === 0 && (
          <p className="font-dm text-text-dim text-xs mt-2">
            No contacts extracted from this document
          </p>
        )}
      </div>
    </div>
  )
}
