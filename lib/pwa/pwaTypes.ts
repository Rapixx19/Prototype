// PWA Showcase Types

export type PhoneScreen =
  | 'lock'
  | 'dashboard'
  | 'chat'
  | 'chat-conversation'
  | 'calendar'
  | 'documents'
  | 'notifications'
  | 'pre-meeting-hub'
  | 'getting-there'
  | 'meeting-brief'
  | 'meeting-chatbot'
  | 'meeting-recording'
  | 'photo-upload'

export type NotificationType = 'meeting' | 'alert' | 'task' | 'document' | 'message'
export type RouteType = 'driving' | 'transit' | 'walking'
export type RouteStatus = 'recommended' | 'delayed' | 'available'

export interface PWANotification {
  id: string
  type: NotificationType
  title: string
  body: string
  time: string
  icon: string
  read: boolean
  meetingId?: string
  projectId?: string
  contactId?: string
}

export interface PWAThread {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  projectId?: string
}

export interface PWAMessage {
  id: string
  threadId: string
  sender: 'user' | 'contact' | 'ai'
  content: string
  time: string
  attachment?: {
    type: 'document' | 'image' | 'link'
    name: string
    preview?: string
  }
}

export interface PWAMeeting {
  id: string
  title: string
  time: string
  date: string
  dateLabel: string
  location: string
  address: string
  attendeeIds: string[]
  projectId: string
  status: 'confirmed' | 'tentative' | 'cancelled'
  briefReady: boolean
  isToday: boolean
  leaveBy: string
  travelTime: string
}

export interface PWARoute {
  id: string
  type: RouteType
  name: string
  duration: string
  durationMins: number
  status: RouteStatus
  statusLabel: string
  details: string
  co2?: string
}

export interface PWAAttendee {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  lastInteraction: string
  relationship: 'Strong' | 'Active' | 'Dormant' | 'Cold'
}

export interface PWAKeyNumber {
  label: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  note?: string
}

export interface PWAKeyItem {
  id: string
  type: 'risk' | 'opportunity' | 'action' | 'deadline'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface PWADocument {
  id: string
  name: string
  type: string
  date: string
  projectId: string
  size: string
  relevance?: 'high' | 'medium' | 'low'
}

export interface PWATask {
  id: string
  title: string
  due: string
  dueLabel: string
  priority: 'high' | 'medium' | 'low'
  projectId: string
  completed: boolean
  overdue: boolean
}

export interface PWACalendarDay {
  date: string
  dayLabel: string
  dayNumber: number
  isToday: boolean
  hasEvents: boolean
  eventCount: number
}

export interface PWAProject {
  id: string
  name: string
  status: string
  documentCount: number
  color: string
}

export interface PWAChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface PWAMeetingBrief {
  meetingId: string
  attendees: PWAAttendee[]
  keyNumbers: PWAKeyNumber[]
  keyItems: PWAKeyItem[]
  documents: PWADocument[]
  summary: string
  objectives: string[]
  talkingPoints: string[]
}

export interface PWATranscriptSegment {
  id: string
  speaker: string
  speakerRole?: string
  content: string
  timestamp: string
  isHighlight?: boolean
  actionItem?: string
}

export interface PWAPhotoCapture {
  id: string
  imageUrl: string
  timestamp: string
  status: 'processing' | 'complete' | 'error'
  ocrText?: string
  extractedData?: {
    type: string
    fields: Record<string, string>
  }
  linkedProject?: string
  linkedDocument?: string
}

export interface PhoneState {
  currentScreen: PhoneScreen
  previousScreen: PhoneScreen | null
  selectedMeetingId: string | null
  selectedThreadId: string | null
  selectedDocumentId: string | null
  isLocked: boolean
  showNotification: boolean
  chatHistory: PWAChatMessage[]
}
