import type { Meeting } from '../types'

export const MEETINGS: Meeting[] = [
  { id: 'meet-01', title: 'Q2 Portfolio Review — Harbour Gate', time: '09:30', date: '2025-04-10', dateLabel: 'Today', location: '14 Finsbury Square — Board Room', attendeeIds: ['cont-01', 'cont-02'], projectId: 'proj-01', status: 'confirmed', briefReady: true, isToday: true },
  { id: 'meet-02', title: 'Harbour Gate — Planning Consent Strategy', time: '14:00', date: '2025-04-10', dateLabel: 'Today', location: 'Zoom', attendeeIds: ['cont-02', 'cont-03'], projectId: 'proj-01', status: 'confirmed', briefReady: true, isToday: true },
  { id: 'meet-03', title: 'Nordic Hospitality — Operator Discussion', time: '16:30', date: '2025-04-10', dateLabel: 'Today', location: 'Call', attendeeIds: ['cont-04', 'cont-05'], projectId: 'proj-02', status: 'tentative', briefReady: false, isToday: true },
  { id: 'meet-04', title: 'Central European Logistics — Initial Review', time: '10:00', date: '2025-04-11', dateLabel: 'Tomorrow', location: '14 Finsbury Square', attendeeIds: ['cont-06'], projectId: 'proj-03', status: 'confirmed', briefReady: false, isToday: false },
  { id: 'meet-05', title: 'Alpine Heritage — Valuation Discrepancy Review', time: '14:30', date: '2025-04-11', dateLabel: 'Tomorrow', location: 'Zoom', attendeeIds: ['cont-08', 'cont-09'], projectId: 'proj-04', status: 'confirmed', briefReady: false, isToday: false },
  { id: 'meet-06', title: 'Mediterranean Mixed-Use — Site Update', time: '11:00', date: '2025-04-14', dateLabel: 'Mon 14 Apr', location: 'Teams Call', attendeeIds: ['cont-10', 'cont-11'], projectId: 'proj-05', status: 'confirmed', briefReady: false, isToday: false },
  { id: 'meet-07', title: 'Northern Energy — Feasibility Presentation', time: '15:00', date: '2025-04-15', dateLabel: 'Tue 15 Apr', location: 'Edinburgh Office', attendeeIds: ['cont-17', 'cont-18'], projectId: 'proj-09', status: 'confirmed', briefReady: false, isToday: false },
  { id: 'meet-08', title: 'Urban Regeneration — Quarterly Update', time: '09:00', date: '2025-04-16', dateLabel: 'Wed 16 Apr', location: 'Manchester Site', attendeeIds: ['cont-19', 'cont-20'], projectId: 'proj-10', status: 'confirmed', briefReady: false, isToday: false },
]
