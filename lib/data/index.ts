import { PROJECTS as _PROJECTS } from './projects'
import { CONTACTS as _CONTACTS } from './contacts'
import { DOCUMENTS } from './documents'
import { MEETINGS } from './meetings'
import { TASKS } from './tasks'
import { INSIGHTS } from './insights'
import { TEAM } from './team'
import { ACTIVITY } from './activity'

// Hydrate document IDs onto projects
const PROJECTS = _PROJECTS.map(p => ({
  ...p,
  documentIds: DOCUMENTS.filter(d => d.projectId === p.id).map(d => d.id)
}))

// Hydrate document IDs onto contacts
const CONTACTS = _CONTACTS.map(c => ({
  ...c,
  documentIds: DOCUMENTS.filter(d => d.contactIds.includes(c.id)).map(d => d.id)
}))

export { PROJECTS, CONTACTS, DOCUMENTS, MEETINGS, TASKS, INSIGHTS, TEAM, ACTIVITY }

// Lookup helpers
export const getProject = (id: string) => PROJECTS.find(p => p.id === id)
export const getContact = (id: string) => CONTACTS.find(c => c.id === id)
export const getDocument = (id: string) => DOCUMENTS.find(d => d.id === id)
export const getMeeting = (id: string) => MEETINGS.find(m => m.id === id)
export const getTeamMember = (id: string) => TEAM.find(t => t.id === id)
export const getProjectDocs = (projectId: string) => DOCUMENTS.filter(d => d.projectId === projectId)
export const getContactDocs = (contactId: string) => DOCUMENTS.filter(d => d.contactIds.includes(contactId))
export const getContactProjects = (contactId: string) => PROJECTS.filter(p => p.contactIds.includes(contactId))

// For CrossConnections component
export function getSharedContacts(project: { id: string; contactIds: string[] }) {
  return project.contactIds.flatMap(contactId => {
    const contact = getContact(contactId)
    if (!contact) return []
    const sharedProjects = PROJECTS.filter(p =>
      p.id !== project.id && p.contactIds.includes(contactId) && p.status !== 'Completed'
    )
    return sharedProjects.length > 0 ? [{ contact, sharedProjects }] : []
  })
}

export function getDocTypeBreakdown(documentIds: string[]) {
  const docs = documentIds.map(id => getDocument(id)).filter(Boolean) as typeof DOCUMENTS
  const counts: Record<string, number> = {}
  docs.forEach(d => { counts[d.type] = (counts[d.type] ?? 0) + 1 })
  return Object.entries(counts).map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
}

// Contact-related helpers
export function getContactDocuments(contactId: string) {
  return DOCUMENTS.filter(d => d.contactIds.includes(contactId))
}

export function getSharedContactsByContact(contactId: string) {
  const contact = getContact(contactId)
  if (!contact) return []
  const sharedProjects = PROJECTS.filter(p => p.contactIds.includes(contactId))
  const otherContactIds = new Set<string>()
  sharedProjects.forEach(p => {
    p.contactIds.forEach(cId => {
      if (cId !== contactId) otherContactIds.add(cId)
    })
  })
  return Array.from(otherContactIds).map(id => getContact(id)).filter(Boolean)
}

export function getDaysSinceContact(lastContact: string): number {
  // Handle formats like "7 Apr 2025", "28 Mar 2025", "Nov 2024"
  const now = new Date('2025-04-10') // Fixed date for prototype
  const parsed = new Date(lastContact)
  if (isNaN(parsed.getTime())) {
    // Try parsing "MMM YYYY" format
    const [month, year] = lastContact.split(' ')
    const monthMap: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }
    if (monthMap[month] !== undefined && year) {
      const date = new Date(parseInt(year), monthMap[month], 15)
      return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    }
    return 999
  }
  return Math.floor((now.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24))
}

export function isContactAtRisk(contact: { strength: string; lastContact: string }): boolean {
  const days = getDaysSinceContact(contact.lastContact)
  // At risk: Dormant/Cold or Strong/Active with >14 days no contact
  if (contact.strength === 'Dormant' || contact.strength === 'Cold') return true
  if ((contact.strength === 'Strong' || contact.strength === 'Active') && days > 14) return true
  return false
}

// Calendar helpers
export function getWeekDays(): { date: string; dayName: string; dayNum: number; isToday: boolean }[] {
  // Week starting from Monday 7 Apr 2025 (prototype fixed week)
  const weekStart = new Date('2025-04-07')
  const today = new Date('2025-04-10')
  const days: { date: string; dayName: string; dayNum: number; isToday: boolean }[] = []
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      dayName: dayNames[i],
      dayNum: date.getDate(),
      isToday: dateStr === today.toISOString().split('T')[0]
    })
  }
  return days
}

export function getMeetingsForDay(date: string) {
  return MEETINGS.filter(m => m.date === date)
}

export function getMeetingAttendees(meetingId: string) {
  const meeting = getMeeting(meetingId)
  if (!meeting) return []
  return meeting.attendeeIds.map(id => getContact(id)).filter(Boolean)
}

export function getMeetingProject(meetingId: string) {
  const meeting = getMeeting(meetingId)
  if (!meeting) return null
  return getProject(meeting.projectId)
}
