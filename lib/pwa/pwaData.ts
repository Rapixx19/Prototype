import type {
  PWANotification,
  PWAThread,
  PWAMessage,
  PWAMeeting,
  PWARoute,
  PWAAttendee,
  PWAKeyNumber,
  PWAKeyItem,
  PWADocument,
  PWATask,
  PWACalendarDay,
  PWAProject,
  PWAMeetingBrief,
  PWATranscriptSegment,
} from './pwaTypes'

// ============================================================================
// NOTIFICATIONS (7 total)
// ============================================================================

export const PWA_NOTIFICATIONS: PWANotification[] = [
  {
    id: 'notif-01',
    type: 'meeting',
    title: 'Upcoming: Q2 Portfolio Review',
    body: 'Leave in 25 mins for Hartley Capital Partners. 3 attendees confirmed.',
    time: '08:05',
    icon: 'calendar',
    read: false,
    meetingId: 'pwa-mtg-01',
    projectId: 'proj-01',
  },
  {
    id: 'notif-02',
    type: 'alert',
    title: 'Planning Consent Deadline',
    body: 'Harbour Gate consent expires in 8 weeks. No task created.',
    time: '07:45',
    icon: 'alert-triangle',
    read: false,
    projectId: 'proj-01',
  },
  {
    id: 'notif-03',
    type: 'document',
    title: 'New Document Indexed',
    body: 'Alpine Heritage valuation report processed. CHF 4.2M variance flagged.',
    time: '07:30',
    icon: 'file-text',
    read: false,
    projectId: 'proj-04',
  },
  {
    id: 'notif-04',
    type: 'message',
    title: 'James Hartley',
    body: 'Looking forward to the meeting today. Shall we discuss the IRR targets?',
    time: '07:15',
    icon: 'message-circle',
    read: true,
    contactId: 'cont-01',
  },
  {
    id: 'notif-05',
    type: 'task',
    title: 'Task Overdue',
    body: 'Equity structure review was due 5 Apr. Assigned to you.',
    time: 'Yesterday',
    icon: 'check-square',
    read: true,
    projectId: 'proj-01',
  },
  {
    id: 'notif-06',
    type: 'alert',
    title: 'Operator Agreement Unsigned',
    body: 'Nordic Hospitality operator agreement 6 weeks overdue.',
    time: 'Yesterday',
    icon: 'alert-circle',
    read: true,
    projectId: 'proj-02',
  },
  {
    id: 'notif-07',
    type: 'meeting',
    title: 'Meeting Brief Ready',
    body: 'Alpine Heritage investor call brief generated. 4 key items flagged.',
    time: '2 days ago',
    icon: 'briefcase',
    read: true,
    meetingId: 'pwa-mtg-03',
    projectId: 'proj-04',
  },
]

// ============================================================================
// THREADS (4 total)
// ============================================================================

export const PWA_THREADS: PWAThread[] = [
  {
    id: 'thread-01',
    name: 'James Hartley',
    avatar: 'JH',
    lastMessage: 'Looking forward to the meeting today. Shall we discuss the IRR targets?',
    time: '07:15',
    unread: 1,
    projectId: 'proj-01',
  },
  {
    id: 'thread-02',
    name: 'Sophie Renard',
    avatar: 'SR',
    lastMessage: 'Planning consent documents have been filed. Awaiting council response.',
    time: 'Yesterday',
    unread: 0,
    projectId: 'proj-01',
  },
  {
    id: 'thread-03',
    name: 'Heinrich Braun',
    avatar: 'HB',
    lastMessage: 'The valuation methodology needs clarification before tomorrow.',
    time: 'Yesterday',
    unread: 2,
    projectId: 'proj-04',
  },
  {
    id: 'thread-04',
    name: 'VecterAI Assistant',
    avatar: 'VA',
    lastMessage: 'I\'ve prepared your morning briefing. 3 high-priority items require attention.',
    time: '08:00',
    unread: 0,
  },
]

// ============================================================================
// MESSAGES
// ============================================================================

export const PWA_MESSAGES: PWAMessage[] = [
  // Thread 01 - James Hartley
  {
    id: 'msg-01-01',
    threadId: 'thread-01',
    sender: 'contact',
    content: 'Good morning. Just reviewing the Q2 portfolio materials.',
    time: '07:00',
  },
  {
    id: 'msg-01-02',
    threadId: 'thread-01',
    sender: 'user',
    content: 'Morning James. All documents are ready in the portal.',
    time: '07:05',
  },
  {
    id: 'msg-01-03',
    threadId: 'thread-01',
    sender: 'contact',
    content: 'Looking forward to the meeting today. Shall we discuss the IRR targets?',
    time: '07:15',
  },
  // Thread 02 - Sophie Renard
  {
    id: 'msg-02-01',
    threadId: 'thread-02',
    sender: 'contact',
    content: 'Planning consent documents have been filed. Awaiting council response.',
    time: 'Yesterday 16:30',
    attachment: {
      type: 'document',
      name: 'Planning_Application_HG_2025.pdf',
    },
  },
  {
    id: 'msg-02-02',
    threadId: 'thread-02',
    sender: 'user',
    content: 'Thanks Sophie. When do you expect a response?',
    time: 'Yesterday 16:45',
  },
  {
    id: 'msg-02-03',
    threadId: 'thread-02',
    sender: 'contact',
    content: 'Typically 6-8 weeks. I\'ll flag any movement immediately.',
    time: 'Yesterday 17:00',
  },
  // Thread 03 - Heinrich Braun
  {
    id: 'msg-03-01',
    threadId: 'thread-03',
    sender: 'contact',
    content: 'I\'ve reviewed the Alpine Heritage valuation. There\'s a CHF 4.2M discrepancy.',
    time: 'Yesterday 14:00',
    attachment: {
      type: 'document',
      name: 'Alpine_Valuation_Q2_2025.xlsx',
    },
  },
  {
    id: 'msg-03-02',
    threadId: 'thread-03',
    sender: 'user',
    content: 'Can you break down where the variance comes from?',
    time: 'Yesterday 14:30',
  },
  {
    id: 'msg-03-03',
    threadId: 'thread-03',
    sender: 'contact',
    content: 'The valuation methodology needs clarification before tomorrow.',
    time: 'Yesterday 15:00',
  },
  // Thread 04 - VecterAI Assistant
  {
    id: 'msg-04-01',
    threadId: 'thread-04',
    sender: 'ai',
    content: 'Good morning. I\'ve prepared your daily intelligence briefing.',
    time: '07:55',
  },
  {
    id: 'msg-04-02',
    threadId: 'thread-04',
    sender: 'ai',
    content: 'I\'ve prepared your morning briefing. 3 high-priority items require attention.',
    time: '08:00',
  },
]

// ============================================================================
// MEETINGS
// ============================================================================

export const PWA_MEETINGS: PWAMeeting[] = [
  {
    id: 'pwa-mtg-01',
    title: 'Q2 Portfolio Review',
    time: '09:30',
    date: '2025-04-10',
    dateLabel: 'Today',
    location: 'Hartley Capital Partners',
    address: '25 Old Broad Street, London EC2N 1HQ',
    attendeeIds: ['cont-01', 'cont-02', 'cont-03'],
    projectId: 'proj-01',
    status: 'confirmed',
    briefReady: true,
    isToday: true,
    leaveBy: '08:55',
    travelTime: '35 mins',
  },
  {
    id: 'pwa-mtg-02',
    title: 'Planning Consent Strategy',
    time: '14:00',
    date: '2025-04-10',
    dateLabel: 'Today',
    location: 'VecterAI Office',
    address: '1 Canada Square, Canary Wharf, London E14 5AB',
    attendeeIds: ['cont-02'],
    projectId: 'proj-01',
    status: 'confirmed',
    briefReady: true,
    isToday: true,
    leaveBy: '—',
    travelTime: 'In office',
  },
  {
    id: 'pwa-mtg-03',
    title: 'Alpine Heritage Call',
    time: '11:00',
    date: '2025-04-11',
    dateLabel: 'Tomorrow',
    location: 'Video Call',
    address: 'Microsoft Teams',
    attendeeIds: ['cont-08', 'cont-09'],
    projectId: 'proj-04',
    status: 'confirmed',
    briefReady: true,
    isToday: false,
    leaveBy: '—',
    travelTime: 'Remote',
  },
  {
    id: 'pwa-mtg-04',
    title: 'Operator Discussion',
    time: '16:30',
    date: '2025-04-10',
    dateLabel: 'Today',
    location: 'Nordic House',
    address: '5 Aldermanbury Square, London EC2V 7HR',
    attendeeIds: ['cont-04', 'cont-05'],
    projectId: 'proj-02',
    status: 'tentative',
    briefReady: false,
    isToday: true,
    leaveBy: '16:05',
    travelTime: '25 mins',
  },
]

// ============================================================================
// ROUTES
// ============================================================================

export const PWA_ROUTES: PWARoute[] = [
  {
    id: 'route-01',
    type: 'transit',
    name: 'Jubilee Line',
    duration: '28 mins',
    durationMins: 28,
    status: 'recommended',
    statusLabel: 'Fastest',
    details: 'Canary Wharf → Bond Street → Bank',
    co2: '0.2 kg',
  },
  {
    id: 'route-02',
    type: 'driving',
    name: 'Via A1261',
    duration: '35 mins',
    durationMins: 35,
    status: 'delayed',
    statusLabel: '+12 mins traffic',
    details: 'Heavy traffic on Limehouse Link',
  },
  {
    id: 'route-03',
    type: 'walking',
    name: 'Thames Path',
    duration: '55 mins',
    durationMins: 55,
    status: 'available',
    statusLabel: 'Available',
    details: '4.2 km via Canary Wharf Pier',
    co2: '0 kg',
  },
]

// ============================================================================
// ATTENDEES
// ============================================================================

export const PWA_ATTENDEES: PWAAttendee[] = [
  {
    id: 'cont-01',
    name: 'James Hartley',
    role: 'Managing Director',
    company: 'Hartley Capital Partners',
    avatar: 'JH',
    lastInteraction: '7 Apr 2025',
    relationship: 'Strong',
  },
  {
    id: 'cont-02',
    name: 'Sophie Renard',
    role: 'Legal Partner',
    company: 'Renard & Associates LLP',
    avatar: 'SR',
    lastInteraction: '5 Apr 2025',
    relationship: 'Active',
  },
  {
    id: 'cont-03',
    name: 'David Okonkwo',
    role: 'Senior Advisor',
    company: 'Meridian Advisory Group',
    avatar: 'DO',
    lastInteraction: '2 Apr 2025',
    relationship: 'Active',
  },
  {
    id: 'cont-04',
    name: 'Astrid Lindqvist',
    role: 'CEO',
    company: 'Nordic Asset Management',
    avatar: 'AL',
    lastInteraction: '6 Apr 2025',
    relationship: 'Strong',
  },
  {
    id: 'cont-05',
    name: 'Erik Solberg',
    role: 'Operations Director',
    company: 'Solberg Hospitality Group',
    avatar: 'ES',
    lastInteraction: '28 Mar 2025',
    relationship: 'Active',
  },
  {
    id: 'cont-08',
    name: 'Heinrich Braun',
    role: 'Partner',
    company: 'Alpine Investment Advisors',
    avatar: 'HB',
    lastInteraction: '8 Apr 2025',
    relationship: 'Strong',
  },
  {
    id: 'cont-09',
    name: 'Claudia Reiter',
    role: 'Heritage Consultant',
    company: 'Reiter Denkmalschutz',
    avatar: 'CR',
    lastInteraction: '20 Mar 2025',
    relationship: 'Active',
  },
]

// ============================================================================
// MEETING BRIEF DATA
// ============================================================================

export const PWA_KEY_NUMBERS: PWAKeyNumber[] = [
  { label: 'Deal Value', value: '£85M', trend: 'neutral' },
  { label: 'Target IRR', value: '18%', trend: 'up', note: '+2% from Q1' },
  { label: 'Equity Committed', value: '£32M', trend: 'neutral' },
  { label: 'Days to Consent', value: '56', trend: 'down', note: 'Deadline approaching' },
]

export const PWA_KEY_ITEMS: PWAKeyItem[] = [
  {
    id: 'ki-01',
    type: 'deadline',
    title: 'Planning consent expires in 8 weeks',
    description: 'No task created to track this deadline. Council response expected within 6-8 weeks.',
    priority: 'high',
  },
  {
    id: 'ki-02',
    type: 'risk',
    title: 'Equity structure review overdue',
    description: 'James Hartley committed to deliver by 5 Apr. Now 5 days overdue.',
    priority: 'high',
  },
  {
    id: 'ki-03',
    type: 'opportunity',
    title: 'IRR target increase potential',
    description: 'Q1 performance suggests 18% target is achievable. Discuss revised projections.',
    priority: 'medium',
  },
  {
    id: 'ki-04',
    type: 'action',
    title: 'Request site visit report',
    description: 'Carlos Fuentes committed to deliver by 14 Apr. Follow up in meeting.',
    priority: 'medium',
  },
]

export const PWA_BRIEF_DOCUMENTS: PWADocument[] = [
  {
    id: 'doc-pwa-01',
    name: 'Q2 Portfolio Summary.pdf',
    type: 'Report',
    date: '8 Apr 2025',
    projectId: 'proj-01',
    size: '2.4 MB',
    relevance: 'high',
  },
  {
    id: 'doc-pwa-02',
    name: 'Harbour Gate Valuation.xlsx',
    type: 'Financial',
    date: '6 Apr 2025',
    projectId: 'proj-01',
    size: '1.1 MB',
    relevance: 'high',
  },
  {
    id: 'doc-pwa-03',
    name: 'Planning Application Status.docx',
    type: 'Legal',
    date: '5 Apr 2025',
    projectId: 'proj-01',
    size: '890 KB',
    relevance: 'medium',
  },
  {
    id: 'doc-pwa-04',
    name: 'Previous Meeting Notes.pdf',
    type: 'Meeting Note',
    date: '1 Apr 2025',
    projectId: 'proj-01',
    size: '450 KB',
    relevance: 'medium',
  },
]

// ============================================================================
// TASKS
// ============================================================================

export const PWA_TASKS: PWATask[] = [
  {
    id: 'pwa-task-01',
    title: 'Review equity structure document',
    due: '5 Apr 2025',
    dueLabel: '5 days overdue',
    priority: 'high',
    projectId: 'proj-01',
    completed: false,
    overdue: true,
  },
  {
    id: 'pwa-task-02',
    title: 'Prepare Q2 portfolio presentation',
    due: '10 Apr 2025',
    dueLabel: 'Today',
    priority: 'high',
    projectId: 'proj-01',
    completed: false,
    overdue: false,
  },
  {
    id: 'pwa-task-03',
    title: 'Follow up on operator agreement',
    due: '12 Apr 2025',
    dueLabel: 'In 2 days',
    priority: 'high',
    projectId: 'proj-02',
    completed: false,
    overdue: false,
  },
  {
    id: 'pwa-task-04',
    title: 'Review Alpine valuation methodology',
    due: '11 Apr 2025',
    dueLabel: 'Tomorrow',
    priority: 'medium',
    projectId: 'proj-04',
    completed: false,
    overdue: false,
  },
  {
    id: 'pwa-task-05',
    title: 'Index new OneDrive documents',
    due: '10 Apr 2025',
    dueLabel: 'Today',
    priority: 'low',
    projectId: 'proj-01',
    completed: false,
    overdue: false,
  },
]

// ============================================================================
// CALENDAR
// ============================================================================

export const PWA_CALENDAR_WEEK: PWACalendarDay[] = [
  { date: '2025-04-07', dayLabel: 'Mon', dayNumber: 7, isToday: false, hasEvents: true, eventCount: 1 },
  { date: '2025-04-08', dayLabel: 'Tue', dayNumber: 8, isToday: false, hasEvents: true, eventCount: 2 },
  { date: '2025-04-09', dayLabel: 'Wed', dayNumber: 9, isToday: false, hasEvents: false, eventCount: 0 },
  { date: '2025-04-10', dayLabel: 'Thu', dayNumber: 10, isToday: true, hasEvents: true, eventCount: 3 },
  { date: '2025-04-11', dayLabel: 'Fri', dayNumber: 11, isToday: false, hasEvents: true, eventCount: 1 },
  { date: '2025-04-12', dayLabel: 'Sat', dayNumber: 12, isToday: false, hasEvents: false, eventCount: 0 },
  { date: '2025-04-13', dayLabel: 'Sun', dayNumber: 13, isToday: false, hasEvents: false, eventCount: 0 },
]

// ============================================================================
// PROJECTS
// ============================================================================

export const PWA_PROJECTS: PWAProject[] = [
  { id: 'proj-01', name: 'Harbour Gate', status: 'Active', documentCount: 24, color: '#3b82f6' },
  { id: 'proj-02', name: 'Nordic Hospitality', status: 'Active', documentCount: 18, color: '#8b5cf6' },
  { id: 'proj-04', name: 'Alpine Heritage', status: 'Active', documentCount: 15, color: '#10b981' },
  { id: 'proj-05', name: 'Iberian Coast', status: 'Pipeline', documentCount: 8, color: '#f59e0b' },
]

// ============================================================================
// MEETING BRIEF
// ============================================================================

export const PWA_MEETING_BRIEF: PWAMeetingBrief = {
  meetingId: 'pwa-mtg-01',
  attendees: PWA_ATTENDEES.filter(a => ['cont-01', 'cont-02', 'cont-03'].includes(a.id)),
  keyNumbers: PWA_KEY_NUMBERS,
  keyItems: PWA_KEY_ITEMS,
  documents: PWA_BRIEF_DOCUMENTS,
  summary: 'Q2 portfolio review focusing on Harbour Gate progress and planning consent timeline. Critical discussion needed on equity structure delay and IRR target adjustment.',
  objectives: [
    'Resolve equity structure review delay with James Hartley',
    'Confirm planning consent submission timeline with Sophie Renard',
    'Align on Q2 IRR target adjustment proposal',
  ],
  talkingPoints: [
    'Open with acknowledgment of Q1 performance exceeding expectations',
    'Address equity structure delay directly — propose revised deadline',
    'Present planning consent risk timeline and mitigation options',
    'Close with agreement on next steps and accountability assignments',
  ],
}

// ============================================================================
// TRANSCRIPT SEGMENTS (for recording demo)
// ============================================================================

export const PWA_TRANSCRIPT_SEGMENTS: PWATranscriptSegment[] = [
  {
    id: 'ts-01',
    speaker: 'James Hartley',
    speakerRole: 'Managing Director',
    content: 'Good morning everyone. Let\'s start with the Q2 portfolio overview.',
    timestamp: '09:31',
    isHighlight: false,
  },
  {
    id: 'ts-02',
    speaker: 'You',
    content: 'Thank you James. I\'ll walk through the key metrics first.',
    timestamp: '09:32',
    isHighlight: false,
  },
  {
    id: 'ts-03',
    speaker: 'You',
    content: 'Harbour Gate is tracking at 18% IRR, up 2 points from Q1 projections.',
    timestamp: '09:33',
    isHighlight: true,
  },
  {
    id: 'ts-04',
    speaker: 'Sophie Renard',
    speakerRole: 'Legal Partner',
    content: 'The planning consent application was submitted on schedule. Council response expected in 6-8 weeks.',
    timestamp: '09:35',
    isHighlight: true,
    actionItem: 'Set reminder for planning consent follow-up in 4 weeks',
  },
  {
    id: 'ts-05',
    speaker: 'James Hartley',
    speakerRole: 'Managing Director',
    content: 'I apologise for the delay on the equity structure review. I can have it to you by end of week.',
    timestamp: '09:38',
    isHighlight: true,
    actionItem: 'James to deliver equity structure review by Friday 11 Apr',
  },
  {
    id: 'ts-06',
    speaker: 'David Okonkwo',
    speakerRole: 'Senior Advisor',
    content: 'From an advisory perspective, the current market conditions support the revised IRR targets.',
    timestamp: '09:41',
    isHighlight: false,
  },
]

// ============================================================================
// LOOKUP HELPERS
// ============================================================================

export const getPWAMeeting = (id: string) => PWA_MEETINGS.find(m => m.id === id)
export const getPWAThread = (id: string) => PWA_THREADS.find(t => t.id === id)
export const getPWAAttendee = (id: string) => PWA_ATTENDEES.find(a => a.id === id)
export const getPWANotification = (id: string) => PWA_NOTIFICATIONS.find(n => n.id === id)
export const getThreadMessages = (threadId: string) => PWA_MESSAGES.filter(m => m.threadId === threadId)
export const getMeetingAttendees = (attendeeIds: string[]) =>
  PWA_ATTENDEES.filter(a => attendeeIds.includes(a.id))
export const getTodayMeetings = () => PWA_MEETINGS.filter(m => m.isToday)
export const getUnreadNotifications = () => PWA_NOTIFICATIONS.filter(n => !n.read)
export const getHighPriorityTasks = () => PWA_TASKS.filter(t => t.priority === 'high' && !t.completed)
