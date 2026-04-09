'use client'

import { AlertTriangle, X } from 'lucide-react'
import type { PWANotification } from '@/lib/pwa/pwaTypes'

export interface AlertBannerProps {
  notification: PWANotification
  onTap: () => void
  onDismiss: () => void
}

export function AlertBanner({ notification, onTap, onDismiss }: AlertBannerProps) {
  return (
    <div
      className="bg-gold/10 border border-gold/30 rounded-xl p-3 cursor-pointer hover:bg-gold/15 transition-colors"
      onClick={onTap}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-gold" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-dm font-semibold text-gold text-xs truncate">
            {notification.title}
          </h4>
          <p className="font-dm text-text-mid text-xs mt-0.5 line-clamp-1">
            {notification.body}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="w-6 h-6 rounded-full bg-app-card flex items-center justify-center flex-shrink-0 hover:bg-app-card2 transition-colors"
        >
          <X className="w-3 h-3 text-text-dim" />
        </button>
      </div>
    </div>
  )
}
