'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { getContact } from '@/lib/data'
import type { Project, Strength } from '@/lib/types'

interface PeopleInvolvedProps {
  project: Project
}

function strengthColor(strength: Strength): 'green' | 'blue' | 'amber' | 'dim' {
  const colors: Record<Strength, 'green' | 'blue' | 'amber' | 'dim'> = {
    Strong: 'green', Active: 'blue', Dormant: 'amber', Cold: 'dim'
  }
  return colors[strength] ?? 'dim'
}

export function PeopleInvolved({ project }: PeopleInvolvedProps) {
  const router = useRouter()

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5 mb-4">
      <SectionLabel>People Involved — {project.contactIds.length} contacts</SectionLabel>
      <div className="mt-3">
        {project.contactIds.map(contactId => {
          const contact = getContact(contactId)
          if (!contact) return null
          return (
            <div
              key={contactId}
              className="flex items-center justify-between py-3 border-b border-app-border last:border-0 hover:opacity-80 cursor-pointer transition-opacity"
              onClick={() => router.push(`/contacts/${contactId}`)}
            >
              <div>
                <div className="font-dm font-medium text-text-primary text-sm">{contact.name}</div>
                <div className="font-dm text-text-dim text-xs">{contact.role} · {contact.company}</div>
                <div className="font-dm text-text-dim text-xs">Last contact: {contact.lastContact}</div>
              </div>
              <Badge label={contact.strength} color={strengthColor(contact.strength)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
