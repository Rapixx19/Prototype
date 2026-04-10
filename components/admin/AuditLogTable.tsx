'use client'

import { LogIn, LogOut, UserPlus, UserMinus, Edit, Eye } from 'lucide-react'
import type { AuditLogEntry } from '@/lib/auth/authTypes'
import { formatDateTime } from '@/lib/auth/authData'

interface AuditLogTableProps {
  entries: AuditLogEntry[]
}

const actionIcons: Record<string, React.ReactNode> = {
  login: <LogIn size={14} className="text-status-green" />,
  logout: <LogOut size={14} className="text-text-dim" />,
  create_user: <UserPlus size={14} className="text-status-blue" />,
  update_user: <Edit size={14} className="text-status-amber" />,
  delete_user: <UserMinus size={14} className="text-status-red" />,
  view_passwords: <Eye size={14} className="text-status-amber" />,
}

const actionLabels: Record<string, string> = {
  login: 'Login',
  logout: 'Logout',
  create_user: 'Created User',
  update_user: 'Updated User',
  delete_user: 'Deleted User',
  view_passwords: 'Viewed Passwords',
}

export function AuditLogTable({ entries }: AuditLogTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-app-card border border-app-border rounded-xl p-8 text-center">
        <p className="font-dm text-text-mid text-sm">No audit log entries yet</p>
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
                  Action
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  User
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Details
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Time
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-app-border last:border-b-0 hover-row">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {actionIcons[entry.action]}
                    <span className="font-dm text-text-primary text-sm">
                      {actionLabels[entry.action] || entry.action}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-dm text-text-mid text-sm font-mono">
                    @{entry.username}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-dm text-text-dim text-sm">
                    {entry.details}
                    {entry.targetUsername && (
                      <span className="text-accent ml-1">@{entry.targetUsername}</span>
                    )}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-dm text-text-dim text-sm">
                    {formatDateTime(entry.timestamp)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
