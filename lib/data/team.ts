import type { TeamMember } from '../types'

export const TEAM: TeamMember[] = [
  { id: 'tm-01', name: 'Alexandra Chen', role: 'owner', roleLabel: 'Managing Partner', avatar: 'AC', email: 'a.chen@vecterai.com', color: '#00C8F0', tasksOpen: 5, tasksCompleted: 23, docsAccessed: 8, status: 'In office', workingOn: 'Alpine Heritage — Valuation Review', lastActive: 'Active now' },
  { id: 'tm-02', name: 'Marcus Webb', role: 'secretary', roleLabel: 'Executive Assistant', avatar: 'MW', email: 'm.webb@vecterai.com', color: '#9B59FF', tasksOpen: 4, tasksCompleted: 31, docsAccessed: 12, status: 'In office', workingOn: "Meeting prep — Today's briefs", lastActive: '12 min ago' },
  { id: 'tm-03', name: 'Priya Sharma', role: 'employee', roleLabel: 'Senior Analyst', avatar: 'PS', email: 'p.sharma@vecterai.com', color: '#00D68F', tasksOpen: 2, tasksCompleted: 18, docsAccessed: 6, status: 'Working remotely', workingOn: 'Northern Energy — Feasibility', lastActive: '34 min ago' },
  { id: 'tm-04', name: 'Tom Barrett', role: 'intern', roleLabel: 'Analyst Intern', avatar: 'TB', email: 't.barrett@vecterai.com', color: '#F5A623', tasksOpen: 1, tasksCompleted: 7, docsAccessed: 3, status: 'In office', workingOn: 'Urban Regeneration — Document Pack', lastActive: '1 hr ago' },
]
