'use client'

import { LayoutDashboard, MessageSquare, Calendar, FileText, Bell } from 'lucide-react'
import type { PhoneScreen } from '@/lib/pwa/pwaTypes'

export interface PhoneNavProps {
  activeTab: PhoneScreen
  onTabChange: (screen: PhoneScreen) => void
}

const tabs: { id: PhoneScreen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'documents', label: 'Docs', icon: FileText },
  { id: 'notifications', label: 'Alerts', icon: Bell },
]

export function PhoneNav({ activeTab, onTabChange }: PhoneNavProps) {
  return (
    <nav className="h-16 bg-app-surface border-t border-app-border flex items-center justify-around px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 transition-colors"
          >
            {/* Active indicator dot */}
            <div className="h-1 flex items-center justify-center">
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-accent" />
              )}
            </div>

            <Icon
              className={`w-5 h-5 transition-colors ${
                isActive ? 'text-accent' : 'text-text-dim'
              }`}
            />

            <span
              className={`font-dm text-[10px] transition-colors ${
                isActive ? 'text-accent font-medium' : 'text-text-dim'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
