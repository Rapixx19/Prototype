import Anthropic from '@anthropic-ai/sdk'
import type { Project, Document, Contact, Meeting, Insight } from './types'
import { getContact, getProject } from './data'

const client = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `You are the VecterAI Knowledge OS — an AI intelligence layer built for a private investment management firm. Your role is to synthesise information from documents, contacts, and project data to produce precise, institutional-grade intelligence for senior investment professionals.

Tone: Analytical, precise, concise. Write like a senior investment analyst briefing a partner — no filler, no generic statements, no obvious observations. Be specific.

Format rules:
- Never use markdown formatting in prose responses (no **bold**, no headers, no bullet symbols)
- When returning JSON, return ONLY valid JSON with no markdown wrapping
- Prose responses: flowing sentences, no lists unless explicitly requested
- Maximum length: follow the specific instructions in each prompt`

export async function callClaude(prompt: string, systemOverride?: string): Promise<string> {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemOverride ?? SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = message.content[0]
    return block.type === 'text' ? block.text : ''
  } catch (error) {
    console.error('Claude API error:', error)
    return 'Intelligence unavailable — please try again.'
  }
}

export async function generateMorningBriefing(role: string): Promise<string> {
  const roleContext = {
    owner: 'the Managing Partner with full portfolio visibility',
    secretary: 'the Executive Assistant managing calendars and communications',
    employee: 'a Senior Analyst working on assigned deal analysis',
    intern: 'an Analyst Intern supporting the deal team',
  }[role] ?? 'a team member'

  return callClaude(`Generate a morning intelligence briefing for ${roleContext} at VecterAI Consulting.

Date: Thursday 10 April 2025, London.

Context:
- 3 meetings today: Q2 Portfolio Review (09:30), Planning Consent strategy call (14:00), operator discussion (16:30 — tentative)
- 3 high-priority alerts: planning consent deadline in 8 weeks on Harbour Gate with no task created; CHF 4.2M valuation discrepancy on Alpine Heritage ahead of tomorrow's meeting; operator agreement 6 weeks unsigned on Nordic Hospitality
- 5 tasks open, 3 of which are high priority
- 8 new documents indexed overnight
- 500 documents total in the knowledge base

Write exactly 3 sentences. First sentence: the most critical thing requiring attention today. Second sentence: what the schedule looks like. Third sentence: one forward-looking observation about this week. No lists. No headers. First-person observations only.`)
}

export async function generateProjectSynthesis(project: Project): Promise<string> {
  const contacts = project.contactIds
    .map(id => getContact(id))
    .filter(Boolean)
    .map(c => `${c!.name} (${c!.role}, ${c!.company}, strength: ${c!.strength})`)
    .join('; ')

  return callClaude(`Write a Project Synthesis Note for an investment firm's internal deal room.

Project: ${project.name}
Asset Type: ${project.type}
Geography: ${project.geography}
Estimated Value: ${project.value}
Target IRR: ${project.irr}
Equity Commitment: ${project.equity}
Status: ${project.status}
Started: ${project.started}
Last Activity: ${project.lastActivity}
Documents in system: ${project.documentIds.length}
Key relationships: ${contacts}
${project.riskFlag ? `Active risk flag: ${project.riskFlag}` : 'No active risk flags.'}

Write 4 sentences as a senior investment analyst would brief a managing partner. Cover: (1) current deal status and stage, (2) key progress or achievements to date, (3) what is outstanding or blocking progress, (4) recommended next action. Specific and analytical — no generic statements. Do not use the word "furthermore" or "moreover". No lists.`)
}

export async function generateDocumentSummary(doc: Document): Promise<{ bullets: string[], narrative: string }> {
  const project = getProject(doc.projectId)

  const raw = await callClaude(`Generate an intelligence summary for a ${doc.type} document in an investment firm's knowledge system.

Document: ${doc.name}
Type: ${doc.type}
Project: ${project?.name ?? 'Unknown'} (${project?.type ?? ''}, ${project?.geography ?? ''})
Asset Value: ${project?.value ?? 'Unknown'}
Source: ${doc.source}
Date: ${doc.date}
Confidence: ${Math.round(doc.confidence * 100)}%

Return this exact JSON structure (no markdown, no code blocks, raw JSON only):
{"bullets":["string","string","string","string"],"narrative":"string"}

Rules:
- 4 bullets, each 8-15 words, specific to this document type and project context
- narrative: one sentence placing this document in the deal context, 15-25 words
- Financial documents: reference likely figures and deal terms
- Legal documents: reference likely obligations, parties, or conditions
- Meeting notes: reference likely decisions, attendees, and actions
- Be specific — avoid generic statements like "this document contains important information"`,
    'You are the VecterAI document intelligence layer. Return only valid JSON. No markdown. No code blocks. Raw JSON only.')

  try {
    const parsed = JSON.parse(raw.trim())
    if (!Array.isArray(parsed.bullets) || typeof parsed.narrative !== 'string') throw new Error('Invalid structure')
    return { bullets: parsed.bullets, narrative: parsed.narrative }
  } catch {
    return {
      bullets: [
        `${doc.type} document related to ${project?.name ?? 'active portfolio'}`,
        `Ingested from ${doc.source} — processed ${doc.date}`,
        `Asset context: ${project?.value ?? 'undisclosed'} · ${project?.geography ?? 'undisclosed'}`,
        `System confidence: ${Math.round(doc.confidence * 100)}% · ${doc.flagged ? 'Flagged for review' : 'Auto-indexed'}`,
      ],
      narrative: `This ${doc.type.toLowerCase()} forms part of the ${project?.name ?? 'portfolio'} record, ingested via ${doc.source}.`,
    }
  }
}

export async function generateContactBio(contact: Contact): Promise<string> {
  const projects = (contact.projectIds ?? [])
    .map(id => getProject(id))
    .filter((p): p is Project => p !== undefined)
    .map(p => `${p.name} (${p.status}, ${p.value})`)
    .join('; ') || 'No projects on record'

  const tags = (contact.tags ?? []).join(', ') || 'General'

  return callClaude(`Write a Contact Intelligence Brief for an investment firm's relationship management system.

Contact: ${contact.name ?? 'Unknown'}
Role: ${contact.role ?? 'Unknown'}
Company: ${contact.company ?? 'Unknown'}
Location: ${contact.location ?? 'Unknown'}
Relationship Strength: ${contact.strength ?? 'Unknown'}
Last Contact: ${contact.lastContact ?? 'Unknown'}
Deals Involved: ${projects}
Areas of Expertise: ${tags}
${contact.introducedBy ? `Introduced by: contact in network` : 'Relationship origin: direct'}

Write 3 sentences as a senior relationship manager would describe this person to a colleague. Cover: (1) who they are professionally and their relevance to the firm, (2) their role in current or past deals, (3) relationship health and any follow-up context. No generic statements. Be specific about their value to the firm.`)
}

export async function generateMeetingBrief(
  meeting: Meeting,
  attendees: Contact[],
  project: Project
): Promise<string> {
  const attendeeContext = attendees
    .map(a => `${a.name} (${a.role} at ${a.company}, relationship: ${a.strength}, last contact: ${a.lastContact})`)
    .join('; ')

  return callClaude(`Generate a pre-meeting intelligence brief for a senior investment professional.

Meeting: ${meeting.title}
Date/Time: ${meeting.dateLabel} at ${meeting.time}
Location: ${meeting.location}
Status: ${meeting.status}

Project Context:
- Name: ${project.name}
- Type: ${project.type}
- Geography: ${project.geography}
- Value: ${project.value}
- Status: ${project.status}
- Target IRR: ${project.irr}
${project.riskFlag ? `- Active risk: ${project.riskFlag}` : ''}

Attendees: ${attendeeContext}

Write a 5-sentence pre-meeting brief. Cover: (1) the purpose and context of this meeting in the deal, (2) one sentence on each key attendee and their role in the relationship, (3) the most important item to address or resolve, (4) recommended approach or opening position. Analytical, precise, written for a partner. No lists.`)
}

export async function generateInsightAnalysis(insight: Insight): Promise<string> {
  const projectContext = insight.projectId
    ? getProject(insight.projectId)
    : null
  const contactContext = insight.contactId
    ? getContact(insight.contactId)
    : null

  return callClaude(`Generate a deep analysis for this portfolio intelligence alert.

Alert Type: ${insight.type}
Severity: ${insight.severity.toUpperCase()}
Alert Body: ${insight.body}
${projectContext ? `Project: ${projectContext.name} (${projectContext.type}, ${projectContext.value}, ${projectContext.status})` : ''}
${contactContext ? `Related Contact: ${contactContext.name} (${contactContext.role} at ${contactContext.company})` : ''}

Write exactly 3 sentences as a senior investment analyst would brief a managing partner. First sentence: the root cause and why this matters to the firm. Second sentence: the potential impact if unaddressed. Third sentence: the recommended immediate action. Be specific and analytical — no generic advice.`)
}

export async function askAssistant(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const messages = [
    ...history.slice(-8).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: `You are the VecterAI Knowledge OS assistant. You are embedded in the platform and help users navigate and understand their system.

You know the following about this platform:
- 500 documents indexed across 10 projects
- Active projects: Harbour Gate Portfolio £340M, Nordic Hospitality €210M, Alpine Heritage CHF 290M, Mediterranean Mixed-Use €155M, Urban Regeneration £175M
- Pipeline: Central European Logistics €180M, Atlantic Residential €120M, Northern Energy £220M
- Completed: Continental Office Fund €480M at 24.3% IRR
- On Hold: Coastal Leisure Assets €95M pending regulatory review
- 20 contacts across London, Madrid, Stockholm, Zurich, Prague, Lisbon, Rome
- Key contacts: James Hartley (Hartley Capital, Strong), Sophie Renard (Renard Associates, Active), Astrid Lindqvist (Nordic Asset Management, Strong), Heinrich Braun (Alpine Investment Advisors, Strong)
- 8 active insights — Alpine Heritage CHF 4.2M valuation discrepancy (High), Harbour Gate planning consent 8 weeks (High), Nordic operator agreement unsigned 6 weeks (High)
- Today's meetings: Q2 Portfolio Review 09:30, Planning Consent call 14:00, Nordic operator discussion 16:30 tentative
- Team: Alexandra Chen (Owner), Marcus Webb (Secretary), Priya Sharma (Employee), Tom Barrett (Intern)
- Microsoft OneDrive and Outlook connected via Graph API — last sync 07:14
- Security: TLS 1.3 in transit, AES-256 at rest, OAuth 2.0, zero data retention on all AI requests

Answer in 1-3 sentences maximum. Be specific — use real names and numbers. Friendly but professional. Never say you cannot help.`,
    messages,
  })
  const block = response.content[0]
  return block.type === 'text' ? block.text : 'Unable to respond.'
}
