export type Role = 'owner' | 'secretary' | 'employee' | 'intern'
export type ProjectStatus = 'Active' | 'Pipeline' | 'Completed' | 'On Hold'
export type DocType = 'Financial' | 'Legal' | 'Meeting Note' | 'Report' | 'Correspondence' | 'Contract' | 'Proposal' | 'Invoice'
export type DocSource = 'OneDrive' | 'Email' | 'Photo Upload' | 'Voice Memo' | 'Manual Upload'
export type Strength = 'Strong' | 'Active' | 'Dormant' | 'Cold'
export type Severity = 'high' | 'medium' | 'low'

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  type: string
  geography: string
  value: string
  valueRaw: number
  irr: string
  equity: string
  documentIds: string[]
  contactIds: string[]
  meetingIds: string[]
  riskFlag: string | null
  started: string
  lastActivity: string
  tags: string[]
}

export interface Contact {
  id: string
  name: string
  role: string
  company: string
  email: string
  phone: string
  location: string
  projectIds: string[]
  documentIds: string[]
  strength: Strength
  lastContact: string
  tags: string[]
  introducedBy: string | null
  commitments?: { description: string; due: string; overdue: boolean }[]
}

export interface Document {
  id: string
  name: string
  type: DocType
  projectId: string
  contactIds: string[]
  relatedDocIds: string[]
  source: DocSource
  date: string
  dateRaw: Date
  confidence: number
  tags: string[]
  size: string
  flagged: boolean
}

export interface Meeting {
  id: string
  title: string
  time: string
  date: string
  dateLabel: string
  location: string
  attendeeIds: string[]
  projectId: string
  status: 'confirmed' | 'tentative' | 'cancelled'
  briefReady: boolean
  isToday: boolean
}

export interface Task {
  id: string
  title: string
  projectId: string
  assignedTo: Role[]
  due: string
  dueLabel: string
  priority: 'high' | 'medium' | 'low'
  overdue: boolean
  completed: boolean
}

export interface Insight {
  id: string
  type: string
  severity: Severity
  body: string
  projectId: string | null
  contactId: string | null
  documentId: string | null
  generatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: Role
  roleLabel: string
  avatar: string
  email: string
  color: string
  tasksOpen: number
  tasksCompleted: number
  docsAccessed: number
  status: string
  workingOn: string
  lastActive: string
}

export interface ActivityItem {
  id: string
  userId: string
  action: string
  resource: string
  resourceType: 'document' | 'project' | 'contact' | 'meeting'
  resourceId: string
  timestamp: string
  timeAgo: string
}
