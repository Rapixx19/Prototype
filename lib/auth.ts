import type { Role } from './types'

const ROLE_KEY = 'vecterai_role'

export function getRole(): Role {
  if (typeof window === 'undefined') return 'owner'
  return (localStorage.getItem(ROLE_KEY) as Role) ?? 'owner'
}

export function setRole(role: Role): void {
  localStorage.setItem(ROLE_KEY, role)
}

export function clearRole(): void {
  localStorage.removeItem(ROLE_KEY)
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    owner: 'Managing Partner',
    secretary: 'Executive Assistant',
    employee: 'Senior Analyst',
    intern: 'Analyst Intern',
  }
  return labels[role]
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    owner: '#00C8F0',
    secretary: '#9B59FF',
    employee: '#00D68F',
    intern: '#F5A623',
  }
  return colors[role]
}

export function canAccess(role: Role, feature: string): boolean {
  const permissions: Record<string, Role[]> = {
    financial:        ['owner'],
    team_full:        ['owner'],
    team_partial:     ['owner', 'secretary'],
    all_projects:     ['owner', 'secretary'],
    assigned_projects:['owner', 'secretary', 'employee'],
    all_documents:    ['owner', 'secretary'],
    insights:         ['owner'],
    onedrive:         ['owner', 'secretary'],
    contacts:         ['owner', 'secretary'],
    admin:            ['owner'],
    morning_full:     ['owner', 'secretary'],
  }
  return permissions[feature]?.includes(role) ?? false
}
