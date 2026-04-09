'use client'

import { usePathname } from 'next/navigation'
import { X, LayoutDashboard, Briefcase, Users, FileText, Calendar, Lightbulb, HardDrive } from 'lucide-react'
import { NavItem } from './NavItem'
import { canAccess, getRoleColor } from '@/lib/auth'
import { TEAM } from '@/lib/data'
import type { Role } from '@/lib/types'

interface SidebarProps {
  role: Role
  isOpen?: boolean
  onClose?: () => void
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/deals', icon: <Briefcase size={18} />, label: 'Deals' },
  { href: '/contacts', icon: <Users size={18} />, label: 'Contacts', feature: 'contacts' },
  { href: '/documents', icon: <FileText size={18} />, label: 'Documents' },
  { href: '/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
  { href: '/team', icon: <Users size={18} />, label: 'Team', feature: 'team_partial' },
  { href: '/insights', icon: <Lightbulb size={18} />, label: 'Insights', feature: 'insights' },
]

export function Sidebar({ role, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const teamMember = TEAM.find((t) => t.role === role)
  const roleColor = getRoleColor(role)

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.feature) return true
    return canAccess(role, item.feature)
  })

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    if (onClose && isOpen) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-[220px] bg-app-surface border-r border-app-border flex flex-col h-full
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo with mobile close button */}
        <div className="p-4 border-b border-app-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-syne font-bold text-accent text-lg tracking-widest">
                VECTERAI
              </div>
              <div className="font-dm text-text-dim text-[10px] tracking-wider">
                KNOWLEDGE OS
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-1 text-text-dim hover:text-text-primary transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <div key={item.href} onClick={handleNavClick}>
              <NavItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              />
            </div>
          ))}
        </nav>

        {/* OneDrive Status */}
        {canAccess(role, 'onedrive') && (
          <div className="px-4 py-3 border-t border-app-border">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-status-green" />
              <span className="text-xs font-dm text-text-dim">OneDrive Connected</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
              <span className="text-[10px] font-dm text-text-dim">
                Synced 07:14 &middot; 500 docs
              </span>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-app-border">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-xs"
              style={{
                backgroundColor: `${roleColor}20`,
                color: roleColor,
                border: `1px solid ${roleColor}40`,
              }}
            >
              {teamMember?.avatar || role.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-dm text-text-primary text-sm truncate">
                {teamMember?.name || 'User'}
              </div>
              <div className="font-dm text-text-dim text-[10px]">
                {teamMember?.roleLabel || role}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
