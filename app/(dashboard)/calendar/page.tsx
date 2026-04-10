'use client'

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, MapPin, Clock, Users, FileText, Briefcase, Sparkles } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { MEETINGS, getWeekDays, getMeetingsForDay, getContact, getProject, getProjectDocs } from '@/lib/data'
import { generateMeetingBrief } from '@/lib/claude'
import { getRole } from '@/lib/auth'
import type { Role, Meeting, Contact, Project } from '@/lib/types'

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

export default function CalendarPage() {
  const role = useRole()
  const mounted = useMounted()
  const router = useRouter()
  const weekDays = getWeekDays()

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [briefs, setBriefs] = useState<Record<string, string>>({})
  const [loadingBrief, setLoadingBrief] = useState<string | null>(null)

  const meetingKey = selectedMeeting ? selectedMeeting.id : ''

  useEffect(() => {
    if (!selectedMeeting || briefs[selectedMeeting.id]) return
    let cancelled = false
    setLoadingBrief(selectedMeeting.id)
    const attendees = selectedMeeting.attendeeIds.map(id => getContact(id)).filter(Boolean) as Contact[]
    const project = getProject(selectedMeeting.projectId)
    if (!project) {
      if (!cancelled) {
        setBriefs(prev => ({ ...prev, [selectedMeeting.id]: 'Project context unavailable.' }))
        setLoadingBrief(null)
      }
      return
    }
    generateMeetingBrief(selectedMeeting, attendees, project).then(result => {
      if (!cancelled) {
        setBriefs(prev => ({ ...prev, [selectedMeeting.id]: result }))
        setLoadingBrief(null)
      }
    }).catch(() => {
      if (!cancelled) {
        setBriefs(prev => ({ ...prev, [selectedMeeting.id]: 'Brief generation failed.' }))
        setLoadingBrief(null)
      }
    })
    return () => { cancelled = true }
  }, [meetingKey, briefs, selectedMeeting])

  const generateBriefForMeeting = useCallback((meeting: Meeting) => {
    if (briefs[meeting.id] || loadingBrief === meeting.id) return
    setLoadingBrief(meeting.id)
    const attendees = meeting.attendeeIds.map(id => getContact(id)).filter(Boolean) as Contact[]
    const project = getProject(meeting.projectId)
    if (!project) {
      setBriefs(prev => ({ ...prev, [meeting.id]: 'Project context unavailable.' }))
      setLoadingBrief(null)
      return
    }
    generateMeetingBrief(meeting, attendees, project).then(result => {
      setBriefs(prev => ({ ...prev, [meeting.id]: result }))
      setLoadingBrief(null)
    }).catch(() => {
      setBriefs(prev => ({ ...prev, [meeting.id]: 'Brief generation failed.' }))
      setLoadingBrief(null)
    })
  }, [briefs, loadingBrief])

  if (!mounted) return null

  const selectedProject = selectedMeeting ? getProject(selectedMeeting.projectId) : null
  const selectedAttendees = selectedMeeting ? selectedMeeting.attendeeIds.map(id => getContact(id)).filter(Boolean) as Contact[] : []
  const relatedDocs = selectedProject ? getProjectDocs(selectedProject.id).slice(0, 5) : []

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <SectionLabel>Meeting Intelligence</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-2xl sm:text-3xl mt-1">Calendar</h1>
        <p className="font-dm text-text-dim text-sm mt-1">{MEETINGS.length} meetings scheduled</p>
      </div>

      <div className="overflow-x-auto pb-2 mb-8">
      <div className="grid grid-cols-7 gap-3 min-w-[700px]">
        {weekDays.map(day => {
          const dayMeetings = getMeetingsForDay(day.date)
          return (
            <div key={day.date} className={`rounded-lg border p-3 min-h-[200px] ${day.isToday ? 'bg-accent-dim/30 border-accent-border' : 'bg-app-card border-app-border'}`}>
              <div className="text-center mb-3">
                <div className={`font-dm text-xs ${day.isToday ? 'text-accent' : 'text-text-dim'}`}>{day.dayName}</div>
                <div className={`font-syne font-bold text-lg ${day.isToday ? 'text-accent' : 'text-text-primary'}`}>{day.dayNum}</div>
              </div>
              <div className="space-y-2">
                {dayMeetings.map(m => (
                  <div key={m.id} onClick={() => setSelectedMeeting(m)} className="p-2 rounded bg-app-surface border border-app-border hover:border-accent-border cursor-pointer transition-colors">
                    <div className="font-dm text-text-primary text-xs truncate">{m.title.split('—')[0].trim()}</div>
                    <div className="font-dm text-text-dim text-[10px]">{m.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      </div>

      <SectionLabel>Upcoming Meetings</SectionLabel>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {MEETINGS.map(meeting => {
          const proj = getProject(meeting.projectId)
          return (
            <Card key={meeting.id} onClick={() => setSelectedMeeting(meeting)} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="font-dm font-medium text-text-primary text-sm truncate">{meeting.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-text-dim text-xs font-dm">
                    <span className="flex items-center gap-1"><Clock size={12} />{meeting.time}</span>
                    <span>{meeting.dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-text-dim text-xs font-dm"><MapPin size={12} />{meeting.location}</div>
                </div>
                <Badge label={meeting.status} color={statusColor(meeting.status)} size="sm" />
              </div>
              {proj && <div className="mt-3 px-2 py-1 bg-app-border/30 rounded text-xs font-dm text-text-dim inline-block">{proj.name}</div>}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-text-dim text-xs font-dm"><Users size={12} />{meeting.attendeeIds.length} attendees</div>
                <button onClick={e => { e.stopPropagation(); generateBriefForMeeting(meeting) }} disabled={!!briefs[meeting.id] || loadingBrief === meeting.id} className="flex items-center gap-1 text-accent text-xs font-dm hover:opacity-80 disabled:opacity-50 transition-opacity">
                  <Sparkles size={12} />{briefs[meeting.id] ? 'Brief Ready' : loadingBrief === meeting.id ? 'Generating...' : 'Generate Brief'}
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedMeeting && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedMeeting(null)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[480px] bg-app-surface border-l border-app-border z-50 overflow-y-auto animate-slide-in">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <SectionLabel>Meeting Details</SectionLabel>
                <button onClick={() => setSelectedMeeting(null)} className="text-text-dim hover:text-text-primary transition-colors"><X size={20} /></button>
              </div>

              <div className="mb-6">
                <h2 className="font-syne font-bold text-text-primary text-xl">{selectedMeeting.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge label={selectedMeeting.status} color={statusColor(selectedMeeting.status)} />
                  <span className="font-dm text-text-dim text-sm">{selectedMeeting.dateLabel} at {selectedMeeting.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-text-dim text-sm font-dm"><MapPin size={14} />{selectedMeeting.location}</div>
              </div>

              <Card className="p-4 mb-4">
                <SectionLabel>AI Pre-Meeting Brief</SectionLabel>
                <div className="mt-3">
                  {loadingBrief === selectedMeeting.id ? <AIGenerating label="Generating brief..." /> : briefs[selectedMeeting.id] ? (
                    <p className="font-dm text-text-mid text-sm leading-relaxed">{briefs[selectedMeeting.id]}</p>
                  ) : (
                    <button onClick={() => generateBriefForMeeting(selectedMeeting)} className="text-accent text-sm font-dm hover:opacity-80 transition-opacity flex items-center gap-1"><Sparkles size={14} />Generate Brief</button>
                  )}
                </div>
              </Card>

              <Card className="p-4 mb-4">
                <SectionLabel>Attendees — {selectedAttendees.length}</SectionLabel>
                <div className="mt-3 space-y-2">
                  {selectedAttendees.map(c => (
                    <div key={c.id} onClick={() => { setSelectedMeeting(null); router.push(`/contacts/${c.id}`) }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-app-card cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center text-accent font-syne text-xs">{c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <div>
                        <div className="font-dm text-text-primary text-sm">{c.name}</div>
                        <div className="font-dm text-text-dim text-xs">{c.role} · {c.company}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {relatedDocs.length > 0 && (
                <Card className="p-4 mb-4">
                  <SectionLabel>Related Documents</SectionLabel>
                  <div className="mt-3 space-y-2">
                    {relatedDocs.map(doc => (
                      <div key={doc.id} onClick={() => { setSelectedMeeting(null); router.push(`/documents/${doc.id}`) }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-app-card cursor-pointer transition-colors">
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

              {selectedProject && (
                <Card className="p-4">
                  <SectionLabel>Project Context</SectionLabel>
                  <div onClick={() => { setSelectedMeeting(null); router.push(`/deals/${selectedProject.id}`) }} className="mt-3 p-3 rounded-lg bg-app-card border border-app-border hover:border-accent-border cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-accent" />
                      <div>
                        <div className="font-dm text-text-primary text-sm">{selectedProject.name}</div>
                        <div className="font-dm text-text-dim text-xs">{selectedProject.type} · {selectedProject.geography} · {selectedProject.value}</div>
                      </div>
                    </div>
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
