'use client'

import { usePathname } from 'next/navigation'
import { X, LayoutDashboard, Briefcase, Users, FileText, Calendar, Lightbulb, HardDrive, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { NavItem } from './NavItem'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/deals', icon: <Briefcase size={18} />, label: 'Deals' },
  { href: '/contacts', icon: <Users size={18} />, label: 'Contacts' },
  { href: '/documents', icon: <FileText size={18} />, label: 'Documents' },
  { href: '/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
  { href: '/team', icon: <Users size={18} />, label: 'Team' },
  { href: '/insights', icon: <Lightbulb size={18} />, label: 'Insights' },
]

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleNavClick = () => {
    if (onClose && isOpen) {
      onClose()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          w-[220px] bg-app-surface border-r border-app-border flex flex-col h-full
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-app-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center font-syne font-bold text-xs bg-accent/10 text-accent border border-accent-border">
                VA
              </div>
              <div>
                <div className="font-syne font-bold text-sm tracking-wide text-accent">
                  VecterAI
                </div>
                <div className="font-dm text-text-dim text-[10px] tracking-wider">
                  KNOWLEDGE OS
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-text-dim hover:text-text-primary transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} onClick={handleNavClick}>
              <NavItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              />
            </div>
          ))}

          <div className="my-3 border-t border-app-border" />

          <div onClick={handleNavClick} className="hidden lg:block">
            <NavItem
              href="/pwa-showcase"
              icon={<Smartphone size={18} />}
              label="VecterAI PWA"
              isActive={pathname === '/pwa-showcase'}
              badge="NEW"
            />
          </div>
        </nav>

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
      </aside>
    </>
  )
}
