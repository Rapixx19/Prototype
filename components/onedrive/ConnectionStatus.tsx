'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Role } from '@/lib/types'

interface ConnectionStatusProps {
  role: Role
}

const PERMISSION_SCOPES = [
  'Files.Read.All',
  'Mail.Read',
  'Calendars.Read',
  'User.Read.All',
  'offline_access',
]

const ACCOUNT_DETAILS = [
  { label: 'Account', value: 'knowledge-os@vecterai.io' },
  { label: 'Tenant', value: 'vecterai.onmicrosoft.com' },
  { label: 'App Registration', value: 'VecterAI Knowledge OS' },
  { label: 'Auth Method', value: 'Client Credentials (OAuth 2.0)' },
  { label: 'Token Status', value: 'Valid · Expires in 47m' },
  { label: 'Sync Mode', value: 'Delta Query · Every 15 minutes' },
]

export function ConnectionStatus({ role }: ConnectionStatusProps) {
  const isReadOnly = role === 'secretary'

  return (
    <div className="space-y-6">
      {/* Connection Banner */}
      <div className="bg-app-card border border-app-border rounded-lg p-5 border-l-4 border-l-status-green">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Microsoft logo placeholder */}
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne font-bold text-text-primary text-base">
                  Microsoft OneDrive
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                  <span className="font-dm text-status-green text-xs font-semibold">
                    Connected · Syncing
                  </span>
                </span>
              </div>
              <div className="font-dm text-text-dim text-xs mt-0.5">
                Connected via Microsoft Graph API · Azure App Registration · OAuth 2.0
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-dm text-text-dim text-xs">Last sync</div>
            <div className="font-syne font-semibold text-text-primary text-sm">
              Today 07:14
            </div>
          </div>
        </div>

        {/* Permission scopes */}
        <div className="mt-4 pt-4 border-t border-app-border">
          <div className="font-dm text-text-dim text-xs mb-2">
            Active Permissions:
          </div>
          <div className="flex flex-wrap gap-2">
            {PERMISSION_SCOPES.map((scope) => (
              <span
                key={scope}
                className="font-dm text-xs text-status-green bg-status-green/10 border border-status-green/20 rounded px-2 py-0.5"
              >
                ✓ {scope}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Microsoft Account Card */}
      <div className="bg-app-card border border-app-border rounded-lg p-5">
        <SectionLabel>Microsoft Account</SectionLabel>
        <div className="mt-3 space-y-3">
          {ACCOUNT_DETAILS.map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="font-dm text-text-dim text-xs flex-shrink-0">
                {label}
              </span>
              <span className="font-dm text-text-primary text-xs text-right">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-app-border">
          <div className="flex gap-2">
            <button
              disabled={isReadOnly}
              className={`flex-1 text-xs font-dm border rounded py-2 transition-colors ${
                isReadOnly
                  ? 'text-text-dim border-app-border cursor-not-allowed opacity-50'
                  : 'text-accent border-accent-border hover:bg-accent-dim'
              }`}
            >
              Force Sync
            </button>
            <button
              disabled={isReadOnly}
              className={`flex-1 text-xs font-dm border rounded py-2 transition-colors ${
                isReadOnly
                  ? 'text-text-dim border-app-border cursor-not-allowed opacity-50'
                  : 'text-text-dim border-app-border hover:border-app-border/60'
              }`}
            >
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
