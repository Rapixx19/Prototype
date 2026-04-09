import type { Document, DocType, DocSource } from '../types'
import { PROJECTS } from './projects'

const DOC_TYPES: DocType[] = ['Financial', 'Legal', 'Meeting Note', 'Report', 'Correspondence', 'Contract', 'Proposal', 'Invoice']

const DOC_COUNTS: Record<string, number> = {
  'proj-01': 62,
  'proj-02': 48,
  'proj-03': 31,
  'proj-04': 54,
  'proj-05': 44,
  'proj-06': 22,
  'proj-07': 71,
  'proj-08': 28,
  'proj-09': 18,
  'proj-10': 38,
  'general': 84,
}

const DOC_NAMES: Record<DocType, string[]> = {
  Financial: ['Term Sheet', 'Valuation Report', 'Financial Model', 'Investment Memo', 'IRR Analysis', 'Capital Structure Note', 'Fee Agreement', 'Equity Summary', 'Debt Facility Agreement', 'P&L Overview', 'Budget Projection', 'Cashflow Forecast', 'Sensitivity Analysis', 'Returns Summary', 'Funding Round Summary'],
  Legal: ['Non-Disclosure Agreement', 'Shareholders Agreement', 'Sale and Purchase Agreement', 'Legal Opinion', 'Due Diligence Report', 'Lease Agreement', 'Planning Consent', 'Heads of Terms', 'Power of Attorney', 'Indemnity Agreement', 'Escrow Agreement', 'Completion Statement', 'Warranty Schedule', 'Restriction Covenant', 'Arbitration Clause'],
  'Meeting Note': ['Board Meeting Notes', 'Investor Call Notes', 'Site Visit Report', 'Legal Review Notes', 'Partner Discussion', 'Stakeholder Meeting', 'Operator Discussion', 'Strategy Session Notes', 'Due Diligence Call', 'Closing Meeting Notes', 'Management Update', 'Advisory Board Notes'],
  Report: ['Market Analysis', 'Feasibility Study', 'Asset Appraisal', 'Risk Assessment', 'ESG Report', 'Competitor Landscape', 'Regulatory Overview', 'Technical Report', 'Exit Analysis', 'Portfolio Review', 'Sector Update', 'Country Risk Report'],
  Correspondence: ['Letter of Intent', 'Offer Letter', 'Response to Query', 'Follow-up Memo', 'Introduction Letter', 'Instruction Letter', 'Engagement Confirmation', 'Status Update', 'Notice Letter', 'Board Resolution', 'Circular Letter'],
  Contract: ['Management Agreement', 'Operator Agreement', 'Advisory Mandate', 'Consultancy Contract', 'Service Agreement', 'Exclusivity Agreement', 'JV Agreement', 'Asset Management Contract', 'Development Agreement', 'Framework Agreement'],
  Proposal: ['Investment Proposal', 'Business Plan', 'Strategic Overview', 'Partnership Proposal', 'Acquisition Proposal', 'Financing Proposal', 'Exit Strategy Document', 'Development Brief', 'Asset Strategy Paper'],
  Invoice: ['Advisory Fee Invoice', 'Legal Services Invoice', 'Consulting Fee Invoice', 'Due Diligence Fee', 'Valuation Fee', 'Management Fee Invoice', 'Professional Services Invoice', 'Retainer Invoice'],
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SOURCES: DocSource[] = ['OneDrive', 'OneDrive', 'OneDrive', 'Email', 'Email', 'Photo Upload', 'Voice Memo', 'Manual Upload']
const EXTENSIONS: Record<DocType, string[]> = {
  Financial: ['pdf', 'xlsx', 'pdf'],
  Legal: ['pdf', 'docx', 'pdf'],
  'Meeting Note': ['docx', 'pdf'],
  Report: ['pdf', 'pdf', 'docx'],
  Correspondence: ['pdf', 'eml'],
  Contract: ['pdf'],
  Proposal: ['pdf', 'pptx'],
  Invoice: ['pdf'],
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function generateDocuments(): Document[] {
  const docs: Document[] = []
  let counter = 1
  const random = seededRandom(42)

  const projectContactMap: Record<string, string[]> = {}
  PROJECTS.forEach(p => { projectContactMap[p.id] = p.contactIds })

  const projectIds = Object.keys(DOC_COUNTS).filter(k => k !== 'general')

  projectIds.forEach((projectId) => {
    const count = DOC_COUNTS[projectId]
    const proj = PROJECTS.find(p => p.id === projectId)!

    for (let i = 0; i < count; i++) {
      const type = DOC_TYPES[Math.floor(random() * DOC_TYPES.length)]
      const names = DOC_NAMES[type]
      const docName = names[Math.floor(random() * names.length)]
      const version = random() > 0.65 ? ` v${Math.floor(random() * 3) + 1}` : ''
      const exts = EXTENSIONS[type]
      const ext = exts[Math.floor(random() * exts.length)]
      const year = 2022 + Math.floor(random() * 3)
      const month = Math.floor(random() * 12)
      const day = Math.floor(random() * 28) + 1
      const source = SOURCES[Math.floor(random() * SOURCES.length)]
      const confidence = 0.79 + random() * 0.21

      const projContacts = projectContactMap[projectId] || []
      const shuffled = [...projContacts].sort(() => random() - 0.5)
      const numContacts = Math.min(Math.floor(random() * 3) + 1, shuffled.length)
      const contactIds = shuffled.slice(0, numContacts)

      const id = `doc-${String(counter).padStart(4, '0')}`
      docs.push({
        id,
        name: `${proj.name} — ${docName}${version}.${ext}`,
        type,
        projectId,
        contactIds,
        relatedDocIds: [],
        source,
        date: `${day} ${MONTHS[month]} ${year}`,
        dateRaw: new Date(year, month, day),
        confidence,
        tags: proj.tags,
        size: `${Math.floor(random() * 8000 + 200)}KB`,
        flagged: confidence < 0.82,
      })
      counter++
    }
  })

  // Add general documents not tied to specific projects
  const generalCount = DOC_COUNTS['general']
  for (let i = 0; i < generalCount; i++) {
    const type = DOC_TYPES[Math.floor(random() * DOC_TYPES.length)]
    const names = DOC_NAMES[type]
    const docName = names[Math.floor(random() * names.length)]
    const version = random() > 0.65 ? ` v${Math.floor(random() * 3) + 1}` : ''
    const exts = EXTENSIONS[type]
    const ext = exts[Math.floor(random() * exts.length)]
    const year = 2022 + Math.floor(random() * 3)
    const month = Math.floor(random() * 12)
    const day = Math.floor(random() * 28) + 1
    const source = SOURCES[Math.floor(random() * SOURCES.length)]
    const confidence = 0.79 + random() * 0.21

    // Randomly assign to a project
    const randomProj = PROJECTS[Math.floor(random() * PROJECTS.length)]
    const projContacts = projectContactMap[randomProj.id] || []
    const shuffled = [...projContacts].sort(() => random() - 0.5)
    const numContacts = Math.min(Math.floor(random() * 3) + 1, shuffled.length)
    const contactIds = shuffled.slice(0, numContacts)

    const id = `doc-${String(counter).padStart(4, '0')}`
    docs.push({
      id,
      name: `${randomProj.name} — ${docName}${version}.${ext}`,
      type,
      projectId: randomProj.id,
      contactIds,
      relatedDocIds: [],
      source,
      date: `${day} ${MONTHS[month]} ${year}`,
      dateRaw: new Date(year, month, day),
      confidence,
      tags: randomProj.tags,
      size: `${Math.floor(random() * 8000 + 200)}KB`,
      flagged: confidence < 0.82,
    })
    counter++
  }

  // Add cross-document related links (same project, similar type)
  docs.forEach(doc => {
    const sameProject = docs.filter(d => d.projectId === doc.projectId && d.id !== doc.id)
    const shuffled = [...sameProject].sort(() => random() - 0.5)
    const related = shuffled.slice(0, Math.min(3, shuffled.length))
    doc.relatedDocIds = related.map(d => d.id)
  })

  return docs
}

export const DOCUMENTS = generateDocuments()
