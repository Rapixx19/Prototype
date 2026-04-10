'use client'

import { useState, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertTriangle, FileText } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { CONTACTS, getProject, getContactDocuments } from '@/lib/data'
import { isContactAtRisk } from '@/lib/data'
import { getRole, canAccess } from '@/lib/auth'
import type { Role, Strength, Contact } from '@/lib/types'

const STRENGTH_TABS: (Strength | 'All')[] = ['All', 'Strong', 'Active', 'Dormant', 'Cold']

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

function strengthColor(strength: Strength): 'green' | 'blue' | 'amber' | 'dim' {
  const colors: Record<Strength, 'green' | 'blue' | 'amber' | 'dim'> = {
    Strong: 'green', Active: 'blue', Dormant: 'amber', Cold: 'dim'
  }
  return colors[strength] ?? 'dim'
}

function ContactCard({ contact }: { contact: Contact }) {
  const router = useRouter()
  const docs = getContactDocuments(contact.id)
  const atRisk = isContactAtRisk(contact)
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <Card onClick={() => router.push(`/contacts/${contact.id}`)} className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center text-accent font-syne font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-dm font-medium text-text-primary text-sm truncate">{contact.name}</span>
            {atRisk && <AlertTriangle size={14} className="text-status-amber shrink-0" />}
          </div>
          <div className="font-dm text-text-dim text-xs truncate">{contact.role}</div>
          <div className="font-dm text-text-dim text-xs truncate">{contact.company}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge label={contact.strength} color={strengthColor(contact.strength)} size="sm" />
        <div className="flex items-center gap-3 text-text-dim text-xs font-dm">
          <span className="flex items-center gap-1">
            <FileText size={12} /> {docs.length}
          </span>
          <span>{contact.location}</span>
        </div>
      </div>
      {contact.projectIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {contact.projectIds.slice(0, 3).map(pid => {
            const proj = getProject(pid)
            return proj ? (
              <span key={pid} className="px-1.5 py-0.5 bg-app-border/30 rounded text-[10px] font-dm text-text-dim truncate max-w-[100px]">
                {proj.name}
              </span>
            ) : null
          })}
          {contact.projectIds.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-dm text-text-dim">+{contact.projectIds.length - 3}</span>
          )}
        </div>
      )}
    </Card>
  )
}

export default function ContactsPage() {
  const role = useRole()
  const mounted = useMounted()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Strength | 'All'>('All')
  const [search, setSearch] = useState('')

  if (!mounted) return null

  if (!canAccess(role, 'contacts')) {
    router.push('/dashboard')
    return null
  }

  const strengthFiltered = activeTab === 'All'
    ? CONTACTS
    : CONTACTS.filter(c => c.strength === activeTab)

  const filtered = strengthFiltered.filter(c => {
    const q = search.toLowerCase()
    return !search ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
  })

  const counts = {
    All: CONTACTS.length,
    Strong: CONTACTS.filter(c => c.strength === 'Strong').length,
    Active: CONTACTS.filter(c => c.strength === 'Active').length,
    Dormant: CONTACTS.filter(c => c.strength === 'Dormant').length,
    Cold: CONTACTS.filter(c => c.strength === 'Cold').length,
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <SectionLabel>Contact Intelligence</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-2xl sm:text-3xl mt-1">Relationship Directory</h1>
        <p className="font-dm text-text-dim text-sm mt-1">{CONTACTS.length} contacts across your portfolio</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {STRENGTH_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-dm rounded-lg transition-colors ${
                activeTab === tab
                  ? 'text-accent bg-accent-dim border border-accent-border'
                  : 'text-text-dim hover:text-text-mid hover:bg-app-card'
              }`}
            >
              {tab} <span className="text-xs ml-1 opacity-70">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="bg-app-card border border-app-border rounded-lg pl-9 pr-4 py-2 text-text-primary font-dm text-sm placeholder:text-text-dim focus:border-accent-border focus:outline-none transition-colors w-full sm:w-64"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary">×</button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-dm text-text-dim text-sm">{search ? `No contacts matching "${search}"` : 'No contacts to display'}</p>
        </div>
      )}
    </div>
  )
}
