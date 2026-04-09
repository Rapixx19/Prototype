'use client'

import { use, useSyncExternalStore, useCallback, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, X, MapPin, Clock, Users, Sparkles, FileText } from 'lucide-react'
import { ProjectHeader } from '@/components/deals/ProjectHeader'
import { ProjectSynthesis } from '@/components/deals/ProjectSynthesis'
import { StatsBar } from '@/components/deals/StatsBar'
import { FinancialSnapshot } from '@/components/deals/FinancialSnapshot'
import { DocumentTimeline } from '@/components/deals/DocumentTimeline'
import { PeopleInvolved } from '@/components/deals/PeopleInvolved'
import { CrossConnections } from '@/components/deals/CrossConnections'
import { ProjectInsights } from '@/components/deals/ProjectInsights'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { getProject, getMeeting, getContact, getProjectDocs } from '@/lib/data'
import { generateMeetingBrief } from '@/lib/claude'
import { getRole, canAccess } from '@/lib/auth'
import type { Role, Meeting, Contact } from '@/lib/types'

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

function statusColor(status: Meeting['status']): 'green' | 'amber' | 'dim' {
  return status === 'confirmed' ? 'green' : status === 'tentative' ? 'amber' : 'dim'
}

export default function DealDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = useRole()
  const mounted = useMounted()

  const project = getProject(id)
  const meetingId = searchParams.get('meeting')

  // Meeting panel state
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [brief, setBrief] = useState<string | null>(null)
  const [loadingBrief, setLoadingBrief] = useState(false)

  // Load meeting from URL param
  useEffect(() => {
    if (meetingId && mounted) {
      const meeting = getMeeting(meetingId)
      if (meeting && meeting.projectId === id) {
        setSelectedMeeting(meeting)
      }
    }
  }, [meetingId, id, mounted])

  // Generate brief when meeting is selected
  useEffect(() => {
    if (!selectedMeeting || brief) return
    let cancelled = false
    setLoadingBrief(true)
    const attendees = selectedMeeting.attendeeIds.map(cId => getContact(cId)).filter(Boolean) as Contact[]
    const proj = getProject(selectedMeeting.projectId)
    if (!proj) {
      if (!cancelled) {
        setBrief('Project context unavailable.')
        setLoadingBrief(false)
      }
      return
    }
    generateMeetingBrief(selectedMeeting, attendees, proj).then(result => {
      if (!cancelled) {
        setBrief(result)
        setLoadingBrief(false)
      }
    }).catch(() => {
      if (!cancelled) {
        setBrief('Brief generation failed.')
        setLoadingBrief(false)
      }
    })
    return () => { cancelled = true }
  }, [selectedMeeting, brief])

  const closeMeetingPanel = useCallback(() => {
    setSelectedMeeting(null)
    setBrief(null)
    // Remove meeting param from URL
    router.push(`/deals/${id}`)
  }, [router, id])

  if (!mounted) return null

  if (!project) {
    router.push('/deals')
    return null
  }

  const selectedAttendees = selectedMeeting
    ? selectedMeeting.attendeeIds.map(cId => getContact(cId)).filter(Boolean) as Contact[]
    : []
  const relatedDocs = selectedMeeting ? getProjectDocs(selectedMeeting.projectId).slice(0, 5) : []

  return (
    <div className="p-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/deals')}
        className="text-accent text-sm font-dm mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Deal Room
      </button>

      {/* Project Header */}
      <ProjectHeader project={project} />

      {/* Risk Alert */}
      {project.riskFlag && (
        <div className="mb-6 flex items-start gap-3 bg-red-950/20 border border-red-900/30 rounded-lg p-4">
          <span className="text-status-red text-lg mt-0.5">⚠</span>
          <div>
            <div className="font-dm font-semibold text-status-red text-sm">Active Risk Flag</div>
            <p className="font-dm text-status-red text-sm leading-relaxed mt-1">{project.riskFlag}</p>
          </div>
        </div>
      )}

      {/* AI Synthesis Card */}
      <ProjectSynthesis project={project} />

      {/* Stats Bar */}
      <StatsBar project={project} role={role} />

      {/* Financial Snapshot - Owner only */}
      {canAccess(role, 'financial') && (
        <FinancialSnapshot project={project} />
      )}

      {/* 3-column grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Document Timeline (60%) */}
        <div className="col-span-7">
          <DocumentTimeline project={project} />
        </div>

        {/* Right: People + Cross-connections + Insights (40%) */}
        <div className="col-span-5 space-y-4">
          <PeopleInvolved project={project} />
          <CrossConnections project={project} />
          <ProjectInsights project={project} role={role} />
        </div>
      </div>

      {/* Meeting Brief Side Panel */}
      {selectedMeeting && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMeetingPanel} />
          <div className="fixed top-0 right-0 h-full w-[480px] bg-app-surface border-l border-app-border z-50 overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <SectionLabel>Meeting Brief</SectionLabel>
                <button onClick={closeMeetingPanel} className="text-text-dim hover:text-text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h2 className="font-syne font-bold text-text-primary text-xl">{selectedMeeting.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge label={selectedMeeting.status} color={statusColor(selectedMeeting.status)} />
                  <span className="font-dm text-text-dim text-sm">{selectedMeeting.dateLabel} at {selectedMeeting.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-text-dim text-sm font-dm">
                  <MapPin size={14} />{selectedMeeting.location}
                </div>
              </div>

              <Card className="p-4 mb-4">
                <SectionLabel>AI Pre-Meeting Brief</SectionLabel>
                <div className="mt-3">
                  {loadingBrief ? (
                    <AIGenerating label="Generating brief..." />
                  ) : brief ? (
                    <p className="font-dm text-text-mid text-sm leading-relaxed">{brief}</p>
                  ) : (
                    <p className="font-dm text-text-dim text-sm">Loading brief...</p>
                  )}
                </div>
              </Card>

              <Card className="p-4 mb-4">
                <SectionLabel>Attendees — {selectedAttendees.length}</SectionLabel>
                <div className="mt-3 space-y-2">
                  {selectedAttendees.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { closeMeetingPanel(); router.push(`/contacts/${c.id}`) }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-app-card cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center text-accent font-syne text-xs">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-dm text-text-primary text-sm">{c.name}</div>
                        <div className="font-dm text-text-dim text-xs">{c.role} · {c.company}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {relatedDocs.length > 0 && (
                <Card className="p-4">
                  <SectionLabel>Related Documents</SectionLabel>
                  <div className="mt-3 space-y-2">
                    {relatedDocs.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => { closeMeetingPanel(); router.push(`/documents/${doc.id}`) }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-app-card cursor-pointer transition-colors"
                      >
                        <FileText size={14} className="text-accent shrink-0" />
                        <div className="min-w-0">
                          <div className="font-dm text-text-primary text-sm truncate">{doc.name}</div>
                          <div className="font-dm text-text-dim text-xs">{doc.type} · {doc.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
