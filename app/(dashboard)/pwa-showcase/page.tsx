'use client'

import { useState, useEffect } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Card } from '@/components/ui/Card'
import { PhoneFrame } from '@/components/pwa/PhoneFrame'
import { LockScreen } from '@/components/pwa/LockScreen'
import { PhoneNav } from '@/components/pwa/PhoneNav'
import { PreMeetingHub } from '@/components/pwa/meeting/PreMeetingHub'
import { GettingThere } from '@/components/pwa/meeting/GettingThere'
import { MeetingBrief } from '@/components/pwa/meeting/MeetingBrief'
import { MeetingChatbot } from '@/components/pwa/meeting/MeetingChatbot'
import { MeetingRecording } from '@/components/pwa/meeting/MeetingRecording'
import { DashboardScreen } from '@/components/pwa/screens/DashboardScreen'
import { ChatScreen } from '@/components/pwa/screens/ChatScreen'
import { ChatConversation } from '@/components/pwa/screens/ChatConversation'
import { CalendarScreen } from '@/components/pwa/screens/CalendarScreen'
import { DocumentsScreen } from '@/components/pwa/screens/DocumentsScreen'
import { NotificationsScreen } from '@/components/pwa/screens/NotificationsScreen'
import { PhotoUpload } from '@/components/pwa/PhotoUpload'
import type { PhoneScreen, PhoneState, PWANotification } from '@/lib/pwa/pwaTypes'
import { PWA_THREADS } from '@/lib/pwa/pwaData'
import {
  MapPin,
  Brain,
  Zap,
  Calendar,
  MessageSquare,
  FileText,
  Bell,
  Monitor
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Real-time meeting briefs and contextual insights'
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description: 'Travel time, routes, and leave-by reminders'
  },
  {
    icon: MessageSquare,
    title: 'Contextual Chat',
    description: 'AI assistant with meeting-specific knowledge'
  },
  {
    icon: FileText,
    title: 'Document Access',
    description: 'Search and browse project documents on-the-go'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Actionable alerts that lead to relevant context'
  }
]

const instructions = [
  { step: 1, text: 'Wait for notification on lock screen' },
  { step: 2, text: 'Tap notification to open pre-meeting hub' },
  { step: 3, text: 'Explore routes, brief, and AI chatbot' },
  { step: 4, text: 'Swipe up to unlock and browse the app' },
  { step: 5, text: 'Navigate using bottom tabs' }
]

// Initial phone state
const initialPhoneState: PhoneState = {
  currentScreen: 'lock',
  previousScreen: null,
  selectedMeetingId: 'pwa-mtg-01',
  selectedThreadId: null,
  selectedDocumentId: null,
  isLocked: true,
  showNotification: false,
  chatHistory: [],
}

// Screens that show bottom navigation
const NAV_VISIBLE_SCREENS: PhoneScreen[] = [
  'dashboard',
  'chat',
  'chat-conversation',
  'calendar',
  'documents',
  'notifications',
]

export default function PWAShowcasePage() {
  const [phoneState, setPhoneState] = useState<PhoneState>(initialPhoneState)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Navigation helper
  const navigate = (screen: PhoneScreen) => {
    setPhoneState(prev => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
      isLocked: screen === 'lock',
    }))
  }

  // Go back to previous screen
  const goBack = () => {
    if (phoneState.previousScreen) {
      navigate(phoneState.previousScreen)
    }
  }

  // Auto-trigger notification after 2 seconds on lock screen
  useEffect(() => {
    if (phoneState.isLocked && !phoneState.showNotification) {
      const timer = setTimeout(() => {
        setPhoneState(prev => ({ ...prev, showNotification: true }))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [phoneState.isLocked, phoneState.showNotification])

  // Check if nav should be visible
  const showNav = NAV_VISIBLE_SCREENS.includes(phoneState.currentScreen)

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center bg-app-bg">
        <div className="w-14 h-14 rounded-2xl bg-app-card border border-app-border flex items-center justify-center mb-6">
          <Monitor className="w-7 h-7 text-accent" />
        </div>
        <h1 className="font-syne font-bold text-text-primary text-xl mb-3">
          Desktop Only
        </h1>
        <p className="font-dm text-text-dim text-sm leading-relaxed max-w-xs">
          The VecterAI PWA showcase is designed for desktop viewing.
          Please open this page on a laptop or desktop to explore the
          mobile experience.
        </p>
      </div>
    )
  }

  // Render current screen content
  const renderScreen = () => {
    switch (phoneState.currentScreen) {
      case 'lock':
        return (
          <LockScreen
            showNotification={phoneState.showNotification}
            onNotificationTap={() => navigate('pre-meeting-hub')}
            onUnlock={() => navigate('dashboard')}
          />
        )

      case 'pre-meeting-hub':
        return (
          <PreMeetingHub
            meetingId={phoneState.selectedMeetingId || 'pwa-mtg-01'}
            onNavigate={navigate}
            onBack={() => navigate('lock')}
          />
        )

      case 'getting-there':
        return (
          <GettingThere
            meetingId={phoneState.selectedMeetingId || 'pwa-mtg-01'}
            onBack={() => navigate('pre-meeting-hub')}
          />
        )

      case 'meeting-brief':
        return (
          <MeetingBrief
            meetingId={phoneState.selectedMeetingId || 'pwa-mtg-01'}
            onBack={() => navigate('pre-meeting-hub')}
          />
        )

      case 'dashboard':
        return (
          <DashboardScreen
            onNavigateToMeeting={(id) => {
              setPhoneState((prev) => ({ ...prev, selectedMeetingId: id }))
              navigate('pre-meeting-hub')
            }}
            onNavigateToTask={() => {
              // Future: navigate to task detail
            }}
            onNavigateToNotification={() => {
              navigate('notifications')
            }}
            onNavigateToPhotoUpload={() => {
              navigate('photo-upload')
            }}
          />
        )

      case 'meeting-chatbot':
        return (
          <MeetingChatbot
            meetingId={phoneState.selectedMeetingId || 'pwa-mtg-01'}
            onBack={() => navigate('pre-meeting-hub')}
          />
        )

      case 'meeting-recording':
        return (
          <MeetingRecording
            meetingId={phoneState.selectedMeetingId || 'pwa-mtg-01'}
            onBack={() => navigate('pre-meeting-hub')}
          />
        )

      case 'photo-upload':
        return (
          <PhotoUpload
            onBack={() => navigate('dashboard')}
          />
        )

      case 'chat':
        return (
          <ChatScreen
            onSelectThread={(threadId) => {
              // VecterAI Assistant thread opens the AI chatbot
              if (threadId === 'thread-04') {
                navigate('meeting-chatbot')
              } else {
                setPhoneState(prev => ({ ...prev, selectedThreadId: threadId }))
                navigate('chat-conversation')
              }
            }}
          />
        )

      case 'chat-conversation':
        return (
          <ChatConversation
            threadId={phoneState.selectedThreadId || 'thread-01'}
            onBack={() => navigate('chat')}
          />
        )

      case 'calendar':
        return (
          <CalendarScreen
            onSelectMeeting={(meetingId) => {
              setPhoneState(prev => ({ ...prev, selectedMeetingId: meetingId }))
              navigate('pre-meeting-hub')
            }}
          />
        )

      case 'documents':
        return <DocumentsScreen />

      case 'notifications':
        return (
          <NotificationsScreen
            onNotificationTap={(notification: PWANotification) => {
              if (notification.type === 'meeting' && notification.meetingId) {
                setPhoneState(prev => ({ ...prev, selectedMeetingId: notification.meetingId! }))
                navigate('pre-meeting-hub')
              } else if (notification.type === 'message' && notification.contactId) {
                // Find thread by contact ID
                const thread = PWA_THREADS.find(t =>
                  t.name.toLowerCase().includes(notification.title.toLowerCase().split(' ')[0])
                )
                if (thread) {
                  setPhoneState(prev => ({ ...prev, selectedThreadId: thread.id }))
                  navigate('chat-conversation')
                }
              } else if (notification.type === 'alert' || notification.type === 'task') {
                // Stay on notifications but could navigate to project in future
              } else if (notification.type === 'document') {
                navigate('documents')
              }
            }}
          />
        )

      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <p className="font-dm text-text-dim text-sm">
              Screen: {phoneState.currentScreen}
            </p>
            <button
              onClick={goBack}
              className="mt-4 px-4 py-2 bg-app-card border border-app-border rounded-lg font-dm text-text-mid text-sm"
            >
              ← Go Back
            </button>
          </div>
        )
    }
  }

  return (
    <div className="p-8 min-h-full">
      {/* Page Header */}
      <div className="mb-8">
        <SectionLabel>Interactive Demo</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">
          VecterAI PWA Showcase
        </h1>
        <p className="font-dm text-text-mid text-sm mt-1 max-w-2xl">
          Experience the VecterAI mobile companion — a progressive web app that brings
          AI-powered meeting intelligence, contextual documents, and smart notifications
          to your pocket.
        </p>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-[280px_1fr_280px] gap-8">
        {/* Left Panel - Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-gold" />
            <span className="font-dm font-semibold text-text-primary text-sm">
              What You&apos;re Seeing
            </span>
          </div>

          {features.map((feature) => (
            <Card key={feature.title} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-dm font-semibold text-text-primary text-sm">
                    {feature.title}
                  </h3>
                  <p className="font-dm text-text-dim text-xs mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Center Panel - Phone */}
        <div className="flex items-start justify-center pt-4">
          <PhoneFrame>
            {/* Screen content with fade animation */}
            <div key={phoneState.currentScreen} className="h-full animate-fade-in">
              {renderScreen()}
            </div>

            {/* Bottom Navigation - only on main screens */}
            {showNav && (
              <PhoneNav
                activeTab={phoneState.currentScreen}
                onTabChange={navigate}
              />
            )}
          </PhoneFrame>
        </div>

        {/* Right Panel - Instructions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gold" />
            <span className="font-dm font-semibold text-text-primary text-sm">
              Try It Out
            </span>
          </div>

          <Card className="p-4">
            <div className="space-y-4">
              {instructions.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-app-card2 border border-app-border flex items-center justify-center flex-shrink-0">
                    <span className="font-dm font-semibold text-accent text-xs">
                      {item.step}
                    </span>
                  </div>
                  <p className="font-dm text-text-mid text-sm pt-0.5">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 border-t-2 border-t-gold">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <h3 className="font-dm font-semibold text-text-primary text-sm">
                  Pro Tip
                </h3>
                <p className="font-dm text-text-dim text-xs mt-1">
                  The notification arrives automatically after 2 seconds on the lock screen.
                  Tap it to jump directly into meeting prep mode.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        :global(.animate-fade-in) {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
