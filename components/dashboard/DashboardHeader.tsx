'use client'

import { usePathname } from 'next/navigation'
import { Search, Menu, LogOut, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime, getOnlineStatusColor, getRoleDisplayLabel } from '@/lib/auth/authData'
import type { TeamUser } from '@/lib/auth/authTypes'

interface DashboardHeaderProps {
  user: TeamUser | null
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
  '/admin': 'Admin',
}

function getBreadcrumb(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return 'Dashboard'

  const base = '/' + parts[0]
  let label = PATH_LABELS[base] || parts[0].charAt(0).toUpperCase() + parts[0].slice(1)

  if (parts.length > 1) {
    const sub = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    label = `${label} / ${sub}`
  }

  return label
}

function getRoleBadgeColor(role: string): 'purple' | 'blue' | 'dim' {
  switch (role) {
    case 'admin':
      return 'purple'
    case 'member':
      return 'blue'
    default:
      return 'dim'
  }
}

export function DashboardHeader({ user, onLogout, onMenuClick }: DashboardHeaderProps) {
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

        {user && (
          <>
            {/* Last login info - hidden on small screens */}
            <div className="hidden lg:flex items-center gap-1.5 text-text-dim">
              <Clock size={12} />
              <span className="text-xs font-dm">
                Last: {user.lastLoginAt ? formatDateTime(user.lastLoginAt).split(',')[0] : 'First login'}
              </span>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-app-card border border-app-border flex items-center justify-center font-syne font-bold text-text-primary text-xs">
                  {user.avatar}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-app-surface"
                  style={{ backgroundColor: getOnlineStatusColor(user.onlineStatus) }}
                />
              </div>
              <div className="hidden md:block">
                <div className="font-dm text-text-primary text-sm font-medium leading-tight">
                  {user.displayName}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    label={getRoleDisplayLabel(user.role)}
                    color={getRoleBadgeColor(user.role)}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-dm text-text-dim hover:text-status-red transition-colors px-2 md:px-3 py-1.5 border border-app-border rounded hover:border-status-red/30 hover:bg-status-red/5"
              title="Logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
