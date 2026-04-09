'use client'

import { use, useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, MapPin, User, AlertTriangle, FileText, ExternalLink } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { getContact, getProject, getContactDocuments, getContactProjects, getSharedContactsByContact } from '@/lib/data'
import { generateContactBio } from '@/lib/claude'
import { getRole, canAccess } from '@/lib/auth'
import type { Role, Strength } from '@/lib/types'

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

function strengthColor(strength: Strength): 'green' | 'blue' | 'amber' | 'dim' {
  const colors: Record<Strength, 'green' | 'blue' | 'amber' | 'dim'> = {
    Strong: 'green', Active: 'blue', Dormant: 'amber', Cold: 'dim'
  }
  return colors[strength] ?? 'dim'
}

export default function ContactDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const role = useRole()
  const mounted = useMounted()
  const [bio, setBio] = useState<string | null>(null)
  const [showAllDocs, setShowAllDocs] = useState(false)

  const contact = getContact(id)
  const contactKey = contact ? `${contact.id}-${contact.name}` : ''

  useEffect(() => {
    if (!contact || bio !== null) return
    let cancelled = false
    generateContactBio(contact).then(result => {
      if (!cancelled) setBio(result)
    }).catch(() => {
      if (!cancelled) setBio('Biography unavailable.')
    })
    return () => { cancelled = true }
  }, [contactKey, bio, contact])

  if (!mounted) return null

  if (!canAccess(role, 'contacts')) {
    router.push('/dashboard')
    return null
  }

  if (!contact) {
    router.push('/contacts')
    return null
  }

  const docs = getContactDocuments(contact.id)
  const projects = getContactProjects(contact.id)
  const sharedContacts = getSharedContactsByContact(contact.id)
  const introducedBy = contact.introducedBy ? getContact(contact.introducedBy) : null
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const displayDocs = showAllDocs ? docs : docs.slice(0, 8)

  return (
    <div className="p-8">
      <button onClick={() => router.push('/contacts')} className="text-accent text-sm font-dm mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity">
        <ArrowLeft className="w-4 h-4" /> Back to Contacts
      </button>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-dim border-2 border-accent-border flex items-center justify-center text-accent font-syne font-bold text-xl">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="font-syne font-bold text-text-primary text-2xl">{contact.name}</h1>
                  <Badge label={contact.strength} color={strengthColor(contact.strength)} />
                </div>
                <p className="font-dm text-text-mid text-sm mt-1">{contact.role} at {contact.company}</p>
                <p className="font-dm text-text-dim text-xs mt-1">Last contact: {contact.lastContact}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {contact.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-app-border/30 rounded text-xs font-dm text-text-dim">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionLabel>AI Biography</SectionLabel>
            <div className="mt-3">
              {bio === null ? <AIGenerating label="Generating biography..." /> : (
                <p className="font-dm text-text-mid text-sm leading-relaxed">{bio}</p>
              )}
            </div>
          </Card>

          {contact.commitments && contact.commitments.length > 0 && (
            <Card className="p-5">
              <SectionLabel>Open Commitments</SectionLabel>
              <div className="mt-3 space-y-2">
                {contact.commitments.map((c, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${c.overdue ? 'bg-status-red/10 border-status-red/30' : 'bg-app-surface border-app-border'}`}>
                    <div className="flex items-center gap-2">
                      {c.overdue && <AlertTriangle size={14} className="text-status-red" />}
                      <span className="font-dm text-text-primary text-sm">{c.description}</span>
                    </div>
                    <span className={`font-dm text-xs ${c.overdue ? 'text-status-red' : 'text-text-dim'}`}>Due: {c.due}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5">
            <SectionLabel>Document Timeline — {docs.length} docs</SectionLabel>
            <div className="mt-3 space-y-2">
              {displayDocs.length > 0 ? displayDocs.map(doc => {
                const proj = getProject(doc.projectId)
                return (
                  <div key={doc.id} onClick={() => router.push(`/documents/${doc.id}`)} className="flex items-center justify-between p-3 rounded-lg bg-app-surface border border-app-border hover:border-accent-border cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={16} className="text-accent shrink-0" />
                      <div className="min-w-0">
                        <div className="font-dm text-text-primary text-sm truncate">{doc.name}</div>
                        <div className="font-dm text-text-dim text-xs">{doc.type} · {doc.date}</div>
                      </div>
                    </div>
                    {proj && <span className="font-dm text-text-dim text-xs shrink-0">{proj.name}</span>}
                  </div>
                )
              }) : <p className="font-dm text-text-dim text-sm">No documents linked.</p>}
              {docs.length > 8 && (
                <button onClick={() => setShowAllDocs(!showAllDocs)} className="text-accent text-sm font-dm hover:opacity-80 transition-opacity mt-2">
                  {showAllDocs ? 'Show less' : `Show all ${docs.length} documents`}
                </button>
              )}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-4">
          <Card className="p-5">
            <SectionLabel>Contact Details</SectionLabel>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3"><Mail size={14} className="text-text-dim" /><span className="font-dm text-text-primary text-sm">{contact.email}</span></div>
              <div className="flex items-center gap-3"><Phone size={14} className="text-text-dim" /><span className="font-dm text-text-primary text-sm">{contact.phone}</span></div>
              <div className="flex items-center gap-3"><MapPin size={14} className="text-text-dim" /><span className="font-dm text-text-primary text-sm">{contact.location}</span></div>
              {introducedBy && (
                <div className="flex items-center gap-3"><User size={14} className="text-text-dim" /><span className="font-dm text-text-primary text-sm">Introduced by <button onClick={() => router.push(`/contacts/${introducedBy.id}`)} className="text-accent hover:opacity-80">{introducedBy.name}</button></span></div>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <SectionLabel>Project Involvement — {projects.length}</SectionLabel>
            <div className="mt-3 space-y-2">
              {projects.length > 0 ? projects.map(proj => (
                <div key={proj.id} onClick={() => router.push(`/deals/${proj.id}`)} className="flex items-center justify-between p-3 rounded-lg bg-app-surface border border-app-border hover:border-accent-border cursor-pointer transition-colors">
                  <div className="min-w-0">
                    <div className="font-dm text-text-primary text-sm truncate">{proj.name}</div>
                    <div className="font-dm text-text-dim text-xs">{proj.type} · {proj.geography}</div>
                  </div>
                  <Badge label={proj.status} color={proj.status === 'Active' ? 'green' : proj.status === 'Pipeline' ? 'blue' : 'dim'} size="sm" />
                </div>
              )) : <p className="font-dm text-text-dim text-sm">No projects linked.</p>}
            </div>
          </Card>

          {sharedContacts.length > 0 && (
            <Card className="p-5">
              <SectionLabel>Cross-Connections — {sharedContacts.length}</SectionLabel>
              <div className="mt-3 space-y-2">
                {sharedContacts.slice(0, 5).map(c => c && (
                  <div key={c.id} onClick={() => router.push(`/contacts/${c.id}`)} className="flex items-center justify-between p-2 rounded-lg hover:bg-app-surface cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center text-accent font-syne text-[10px]">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-dm text-text-primary text-sm">{c.name}</span>
                    </div>
                    <ExternalLink size={12} className="text-text-dim" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
