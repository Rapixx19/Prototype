'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react'
import { getPWAMeeting, PWA_ROUTES } from '@/lib/pwa/pwaData'
import { RouteMap } from './RouteMap'
import { RouteCard } from './RouteCard'

export interface GettingThereProps {
  meetingId: string
  onBack: () => void
}

export function GettingThere({ meetingId, onBack }: GettingThereProps) {
  const [selectedRoute, setSelectedRoute] = useState<string>('route-01')
  const meeting = getPWAMeeting(meetingId)

  if (!meeting) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="font-dm text-text-dim text-sm">Meeting not found</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-app-card flex items-center justify-center hover:bg-app-card2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-text-mid" />
        </button>
        <span className="font-dm font-semibold text-text-primary text-sm">Getting There</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 mb-4">
          <RouteMap destination={meeting.location} />
        </div>

        {/* Destination Info */}
        <div className="px-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-dm font-semibold text-text-primary text-sm">{meeting.location}</h3>
              <p className="font-dm text-text-dim text-xs mt-0.5">{meeting.address}</p>
            </div>
          </div>
        </div>

        {/* Route Options */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-text-dim" />
            <span className="font-dm text-text-dim text-xs uppercase tracking-wide">Route Options</span>
          </div>
          <div className="space-y-2">
            {PWA_ROUTES.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={selectedRoute === route.id}
                onSelect={() => setSelectedRoute(route.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4 pt-2">
        <button className="w-full bg-accent hover:bg-accent/90 text-app-bg font-dm font-semibold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          <Navigation className="w-4 h-4" />
          Start Navigation
        </button>
      </div>
    </div>
  )
}
