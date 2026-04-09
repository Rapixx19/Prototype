'use client'

import { Calendar, AlertTriangle, FileText, MessageCircle, CheckSquare, Bell } from 'lucide-react'
import { PWA_NOTIFICATIONS } from '@/lib/pwa/pwaData'
import type { PWANotification } from '@/lib/pwa/pwaTypes'

export interface NotificationsScreenProps {
  onNotificationTap?: (notification: PWANotification) => void
}

export function NotificationsScreen({ onNotificationTap }: NotificationsScreenProps = {}) {
  const unreadNotifications = PWA_NOTIFICATIONS.filter(n => !n.read)
  const readNotifications = PWA_NOTIFICATIONS.filter(n => n.read)

  const getNotificationIcon = (type: PWANotification['type']) => {
    switch (type) {
      case 'meeting':
        return Calendar
      case 'alert':
        return AlertTriangle
      case 'document':
        return FileText
      case 'message':
        return MessageCircle
      case 'task':
        return CheckSquare
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: PWANotification['type']) => {
    switch (type) {
      case 'meeting':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400' }
      case 'alert':
        return { bg: 'bg-gold/20', text: 'text-gold' }
      case 'document':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' }
      case 'message':
        return { bg: 'bg-accent/20', text: 'text-accent' }
      case 'task':
        return { bg: 'bg-rose-500/20', text: 'text-rose-400' }
      default:
        return { bg: 'bg-app-card2', text: 'text-text-dim' }
    }
  }

  const renderNotification = (notification: PWANotification, isUnread: boolean) => {
    const Icon = getNotificationIcon(notification.type)
    const colors = getNotificationColor(notification.type)

    return (
      <button
        key={notification.id}
        onClick={() => onNotificationTap?.(notification)}
        className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-colors text-left ${
          isUnread
            ? 'bg-app-card border-app-border hover:border-accent/30'
            : 'bg-app-card/50 border-transparent hover:bg-app-card'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-dm font-semibold text-sm truncate ${
              isUnread ? 'text-text-primary' : 'text-text-mid'
            }`}>
              {notification.title}
            </h3>
            {isUnread && (
              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
            )}
          </div>
          <p className={`font-dm text-xs mt-0.5 line-clamp-2 ${
            isUnread ? 'text-text-mid' : 'text-text-dim'
          }`}>
            {notification.body}
          </p>
          <p className="font-dm text-text-dim text-[10px] mt-1">
            {notification.time}
          </p>
        </div>
      </button>
    )
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="font-syne font-bold text-text-primary text-xl">Notifications</h1>
          {unreadNotifications.length > 0 && (
            <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full font-dm text-xs font-medium">
              {unreadNotifications.length} new
            </span>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Unread section */}
        {unreadNotifications.length > 0 && (
          <div className="mb-6">
            <h2 className="font-dm font-semibold text-text-mid text-xs uppercase tracking-wide mb-3">
              Unread
            </h2>
            <div className="space-y-2">
              {unreadNotifications.map(n => renderNotification(n, true))}
            </div>
          </div>
        )}

        {/* Earlier section */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="font-dm font-semibold text-text-mid text-xs uppercase tracking-wide mb-3">
              Earlier
            </h2>
            <div className="space-y-2">
              {readNotifications.map(n => renderNotification(n, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
