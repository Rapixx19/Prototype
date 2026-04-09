'use client'

import { AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import type { PWAKeyItem } from '@/lib/pwa/pwaTypes'

interface KeyItemCardProps {
  item: PWAKeyItem
}

const getTypeConfig = (type: PWAKeyItem['type']) => {
  switch (type) {
    case 'risk': return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' }
    case 'opportunity': return { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    case 'action': return { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10' }
    case 'deadline': return { icon: Clock, color: 'text-gold', bg: 'bg-gold/10' }
  }
}

const getPriorityBadge = (priority: PWAKeyItem['priority']) => {
  switch (priority) {
    case 'high': return 'bg-rose-500/20 text-rose-500'
    case 'medium': return 'bg-gold/20 text-gold'
    case 'low': return 'bg-app-card2 text-text-dim'
  }
}

export function KeyItemCard({ item }: KeyItemCardProps) {
  const config = getTypeConfig(item.type)
  const Icon = config.icon

  return (
    <div className="p-3 bg-app-card rounded-xl border border-app-border">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-dm font-semibold text-text-primary text-xs">{item.title}</h4>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-dm font-medium flex-shrink-0 ${getPriorityBadge(item.priority)}`}>
              {item.priority}
            </span>
          </div>
          <p className="font-dm text-text-dim text-[11px] leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  )
}
