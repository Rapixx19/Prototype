'use client'

import { usePathname } from 'next/navigation'
import { Search, Menu } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Role } from '@/lib/types'

interface TopbarProps {
  role: Role
  roleLabel: string
  onLogout: () => void
  onMenuClick?: () => void
}

const PATH_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/deals': 'Deals',
  '/contacts': 'Contacts',
  '/documents': 'Documents',
  '/calendar': 'Calendar',
  '/team': 'Team',
  '/insights': 'Insights',
  '/onedrive': 'OneDrive',
}

function getBreadcrumb(pathname: string): string {
  const base = '/' + pathname.split('/')[1]
  return PATH_LABELS[base] || 'Dashboard'
}

function getBadgeColor(role: Role): 'accent' | 'purple' | 'green' | 'amber' {
  const colors: Record<Role, 'accent' | 'purple' | 'green' | 'amber'> = {
    owner: 'accent',
    secretary: 'purple',
    employee: 'green',
    intern: 'amber',
  }
  return colors[role]
}

export function Topbar({ role, roleLabel, onLogout, onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const breadcrumb = getBreadcrumb(pathname)

  return (
    <header className="h-14 bg-app-surface border-b border-app-border flex items-center justify-between px-4 md:px-6">
      {/* Left side - Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 text-text-mid hover:text-text-primary hover:bg-app-card rounded transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="font-dm text-text-dim text-sm hidden sm:inline">VecterAI</span>
          <span className="text-text-dim hidden sm:inline">/</span>
          <span className="font-dm text-text-primary text-sm">{breadcrumb}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - hidden on very small screens */}
        <div className="relative hidden sm:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-32 md:w-48 h-8 pl-9 pr-3 bg-app-card border border-app-border rounded text-sm font-dm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-border transition-colors"
          />
        </div>

        {/* Role Badge - abbreviated on small screens */}
        <Badge label={roleLabel} color={getBadgeColor(role)} />

        {/* Switch Role */}
        <button
          onClick={onLogout}
          className="text-xs font-dm text-text-dim hover:text-accent transition-colors px-2 md:px-3 py-1 border border-app-border rounded hover:border-accent-border whitespace-nowrap"
        >
          <span className="hidden sm:inline">Switch Role</span>
          <span className="sm:hidden">Switch</span>
        </button>
      </div>
    </header>
  )
}
