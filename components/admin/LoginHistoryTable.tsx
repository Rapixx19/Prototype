'use client'

import { Monitor, Clock, LogIn, LogOut } from 'lucide-react'
import type { LoginHistoryEntry } from '@/lib/auth/authTypes'
import { formatDateTime } from '@/lib/auth/authData'

interface LoginHistoryTableProps {
  entries: LoginHistoryEntry[]
}

export function LoginHistoryTable({ entries }: LoginHistoryTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-app-card border border-app-border rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-app-surface mx-auto mb-4 flex items-center justify-center">
          <Clock size={24} className="text-text-dim" />
        </div>
        <p className="font-dm text-text-mid text-sm">No login history yet</p>
      </div>
    )
  }

  return (
    <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-app-border">
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  User
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Login Time
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Logout Time
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Duration
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Device
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Status
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-app-border last:border-b-0 hover-row">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-app-surface border border-app-border flex items-center justify-center font-syne font-bold text-text-primary text-xs">
                      {entry.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-dm text-text-primary text-sm font-medium">
                        {entry.displayName}
                      </div>
                      <div className="font-dm text-text-dim text-xs">@{entry.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <LogIn size={14} className="text-status-green" />
                    <span className="font-dm text-text-mid text-sm">
                      {formatDateTime(entry.loginAt)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {entry.logoutAt ? (
                    <div className="flex items-center gap-2">
                      <LogOut size={14} className="text-text-dim" />
                      <span className="font-dm text-text-mid text-sm">
                        {formatDateTime(entry.logoutAt)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-dm text-text-dim text-sm">-</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-dim" />
                    <span className={`font-dm text-sm ${entry.logoutAt ? 'text-text-mid' : 'text-accent'}`}>
                      {entry.duration || 'Active'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Monitor size={14} className="text-text-dim" />
                    <span className="font-dm text-text-dim text-sm">{entry.device}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {entry.logoutAt ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-dm bg-app-surface border border-app-border text-text-dim">
                      Ended
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-dm bg-accent/20 text-accent animate-pulse">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
