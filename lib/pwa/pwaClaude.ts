import type { PWAMeeting, PWAAttendee, PWAKeyItem, PWAKeyNumber, PWADocument } from './pwaTypes'

interface MeetingContext {
  meeting: PWAMeeting
  attendees: PWAAttendee[]
  keyNumbers: PWAKeyNumber[]
  keyItems: PWAKeyItem[]
  documents: PWADocument[]
  summary: string
}

function buildMeetingContextPrompt(context: MeetingContext): string {
  const attendeeList = context.attendees
    .map(a => `${a.name} (${a.role} at ${a.company}, relationship: ${a.relationship}, last contact: ${a.lastInteraction})`)
    .join('; ')

  const keyNumbersList = context.keyNumbers
    .map(kn => `${kn.label}: ${kn.value}${kn.note ? ` (${kn.note})` : ''}`)
    .join('; ')

  const keyItemsList = context.keyItems
    .map(ki => `[${ki.type.toUpperCase()}] ${ki.title}: ${ki.description}`)
    .join('\n')

  const documentsList = context.documents
    .map(d => `${d.name} (${d.type}, ${d.date})`)
    .join('; ')

  return `MEETING CONTEXT:
Meeting: ${context.meeting.title}
Date/Time: ${context.meeting.dateLabel} at ${context.meeting.time}
Location: ${context.meeting.location}
Address: ${context.meeting.address}
Status: ${context.meeting.status}
Travel: Leave by ${context.meeting.leaveBy} (${context.meeting.travelTime})

Attendees: ${attendeeList}

Key Numbers: ${keyNumbersList}

Key Items:
${keyItemsList}

Related Documents: ${documentsList}

Brief Summary: ${context.summary}`
}

export async function callPWAClaude(
  userMessage: string,
  context: MeetingContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const contextPrompt = buildMeetingContextPrompt(context)

  try {
    const response = await fetch('/api/pwa-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contextPrompt,
        userMessage,
        conversationHistory,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || 'No response received.'
  } catch (error) {
    console.error('PWA Claude API error:', error)
    return 'Unable to connect to VecterAI intelligence. Please try again.'
  }
}

export async function generateQuickMeetingInsight(context: MeetingContext): Promise<string> {
  const contextPrompt = buildMeetingContextPrompt(context)

  try {
    const response = await fetch('/api/pwa-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contextPrompt,
        userMessage: 'Generate a 2-sentence pre-meeting insight. First sentence: the most critical thing to address. Second sentence: recommended opening approach.',
        conversationHistory: [],
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || 'Meeting insight unavailable.'
  } catch (error) {
    console.error('PWA Claude API error:', error)
    return 'Meeting insight unavailable. Review the key items for critical discussion points.'
  }
}

export const SUGGESTED_QUESTIONS = [
  'What should I focus on in this meeting?',
  'Summarize James Hartley\'s recent commitments',
  'What are the risks I should address?',
  'What documents should I reference?',
  'Give me a quick background on the attendees',
]

export const WELCOME_MESSAGE = `I'm ready to help you prepare for the Q2 Portfolio Review. I have context on the 3 attendees, 4 key items flagged, and relevant deal metrics.

What would you like to know?`
