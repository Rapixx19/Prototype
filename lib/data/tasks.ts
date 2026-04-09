import type { Task } from '../types'

export const TASKS: Task[] = [
  { id: 'task-01', title: 'Chase planning consent renewal — Harbour Gate', projectId: 'proj-01', assignedTo: ['owner'], due: '2025-04-10', dueLabel: 'Overdue — 3 days', priority: 'high', overdue: true, completed: false },
  { id: 'task-02', title: 'Review and sign operator term sheet — Nordic', projectId: 'proj-02', assignedTo: ['owner'], due: '2025-04-10', dueLabel: 'Due today', priority: 'high', overdue: false, completed: false },
  { id: 'task-03', title: 'Resolve Alpine Heritage valuation discrepancy', projectId: 'proj-04', assignedTo: ['owner'], due: '2025-04-10', dueLabel: 'Due today', priority: 'high', overdue: false, completed: false },
  { id: 'task-04', title: 'Send updated investment deck to Lindqvist', projectId: 'proj-02', assignedTo: ['owner', 'secretary'], due: '2025-04-11', dueLabel: 'Tomorrow', priority: 'medium', overdue: false, completed: false },
  { id: 'task-05', title: 'Schedule site visit — Mediterranean Mixed-Use', projectId: 'proj-05', assignedTo: ['secretary'], due: '2025-04-11', dueLabel: 'Tomorrow', priority: 'medium', overdue: false, completed: false },
  { id: 'task-06', title: 'Request updated feasibility — Central European Logistics', projectId: 'proj-03', assignedTo: ['owner'], due: '2025-04-14', dueLabel: 'Mon 14 Apr', priority: 'medium', overdue: false, completed: false },
  { id: 'task-07', title: 'Prepare board pack — Q2 portfolio', projectId: 'proj-01', assignedTo: ['owner', 'secretary'], due: '2025-04-15', dueLabel: 'Tue 15 Apr', priority: 'medium', overdue: false, completed: false },
  { id: 'task-08', title: "Follow up with Côte d'Azur Ventures re: hold status", projectId: 'proj-08', assignedTo: ['owner'], due: '2025-04-14', dueLabel: 'Mon 14 Apr', priority: 'low', overdue: false, completed: false },
  { id: 'task-09', title: 'Draft NDA for Northern Energy Transition', projectId: 'proj-09', assignedTo: ['employee'], due: '2025-04-11', dueLabel: 'Tomorrow', priority: 'medium', overdue: false, completed: false },
  { id: 'task-10', title: 'Compile Urban Regeneration document pack', projectId: 'proj-10', assignedTo: ['employee'], due: '2025-04-15', dueLabel: 'Tue 15 Apr', priority: 'low', overdue: false, completed: false },
  { id: 'task-11', title: 'Update contact records — Atlantic Residential', projectId: 'proj-06', assignedTo: ['secretary'], due: '2025-04-16', dueLabel: 'Wed 16 Apr', priority: 'low', overdue: false, completed: false },
  { id: 'task-12', title: 'Archive completed Continental Office documents', projectId: 'proj-07', assignedTo: ['secretary'], due: '2025-04-17', dueLabel: 'Thu 17 Apr', priority: 'low', overdue: false, completed: false },
]
