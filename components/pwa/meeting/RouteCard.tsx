'use client'

import { Train, Car, Footprints, Leaf } from 'lucide-react'
import type { PWARoute, RouteType, RouteStatus } from '@/lib/pwa/pwaTypes'

interface RouteCardProps {
  route: PWARoute
  isSelected: boolean
  onSelect: () => void
}

const getRouteIcon = (type: RouteType) => {
  switch (type) {
    case 'transit': return Train
    case 'driving': return Car
    case 'walking': return Footprints
  }
}

const getStatusStyles = (status: RouteStatus, isSelected: boolean) => {
  if (isSelected) return 'border-accent bg-accent/10'
  switch (status) {
    case 'recommended': return 'border-emerald-500/50 hover:border-emerald-500'
    case 'delayed': return 'border-gold/50 hover:border-gold'
    default: return 'border-app-border hover:border-text-dim'
  }
}

const getIconStyles = (status: RouteStatus, isSelected: boolean) => {
  if (isSelected) return { container: 'bg-accent/20', icon: 'text-accent' }
  switch (status) {
    case 'recommended': return { container: 'bg-emerald-500/20', icon: 'text-emerald-500' }
    case 'delayed': return { container: 'bg-gold/20', icon: 'text-gold' }
    default: return { container: 'bg-app-card2', icon: 'text-text-mid' }
  }
}

const getBadgeStyles = (status: RouteStatus) => {
  switch (status) {
    case 'recommended': return 'bg-emerald-500/20 text-emerald-500'
    case 'delayed': return 'bg-gold/20 text-gold'
    default: return 'bg-app-card2 text-text-dim'
  }
}

export function RouteCard({ route, isSelected, onSelect }: RouteCardProps) {
  const Icon = getRouteIcon(route.type)
  const iconStyles = getIconStyles(route.status, isSelected)

  return (
    <button
      onClick={onSelect}
      className={`w-full bg-app-card rounded-xl p-4 border transition-colors text-left ${getStatusStyles(route.status, isSelected)}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyles.container}`}>
          <Icon className={`w-5 h-5 ${iconStyles.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className="font-dm font-semibold text-text-primary text-sm">{route.name}</h4>
            <span className="font-dm font-semibold text-text-primary text-sm">{route.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-dm text-text-dim text-xs">{route.details}</p>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-dm font-medium ${getBadgeStyles(route.status)}`}>
              {route.statusLabel}
            </span>
          </div>
        </div>
      </div>
      {route.co2 && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-app-border">
          <Leaf className="w-3 h-3 text-emerald-500" />
          <span className="font-dm text-emerald-500 text-[10px]">{route.co2} CO2</span>
        </div>
      )}
    </button>
  )
}
