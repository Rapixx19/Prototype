'use client'

import { useState } from 'react'
import { Edit2, Trash2, Eye, EyeOff, Shield, User, UserCheck } from 'lucide-react'
import type { TeamUser } from '@/lib/auth/authTypes'
import { formatDateTime, getRoleDisplayLabel, getOnlineStatusColor } from '@/lib/auth/authData'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface UserTableProps {
  users: TeamUser[]
  currentUserId: string
  onEdit: (user: TeamUser) => void
  onDelete: (user: TeamUser) => void
  onPasswordsViewed: () => void
}

export function UserTable({ users, currentUserId, onEdit, onDelete, onPasswordsViewed }: UserTableProps) {
  const [showPasswords, setShowPasswords] = useState(false)

  const handleTogglePasswords = () => {
    if (!showPasswords) {
      onPasswordsViewed()
    }
    setShowPasswords(!showPasswords)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'purple'
      case 'member':
        return 'blue'
      case 'viewer':
        return 'dim'
      default:
        return 'dim'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'dim'
      case 'suspended':
        return 'red'
      default:
        return 'dim'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield size={14} />
      case 'member':
        return <UserCheck size={14} />
      default:
        return <User size={14} />
    }
  }

  return (
    <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
      {/* Password Warning Banner */}
      {showPasswords && (
        <div className="px-5 py-3 bg-status-amber/10 border-b border-status-amber/20 flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-status-amber/20 flex items-center justify-center">
            <Eye size={16} className="text-status-amber" />
          </div>
          <div>
            <div className="font-dm text-status-amber text-sm font-medium">
              Passwords are visible
            </div>
            <div className="font-dm text-status-amber/70 text-xs">
              This action has been logged for security purposes
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="px-5 py-3 border-b border-app-border flex items-center justify-between bg-app-surface/50">
        <span className="font-dm text-text-dim text-sm">
          {users.length} team {users.length === 1 ? 'member' : 'members'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTogglePasswords}
        >
          {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
          <span className="ml-1">{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
        </Button>
      </div>

      {/* Table */}
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
                  Username
                </span>
              </th>
              {showPasswords && (
                <th className="px-5 py-3 text-left">
                  <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                    Password
                  </span>
                </th>
              )}
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Role
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Status
                </span>
              </th>
              <th className="px-5 py-3 text-left">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Last Login
                </span>
              </th>
              <th className="px-5 py-3 text-right">
                <span className="font-dm text-[10px] font-bold text-text-dim tracking-widest uppercase">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-app-border last:border-b-0 hover-row">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-app-surface border border-app-border flex items-center justify-center font-syne font-bold text-text-primary text-sm">
                        {user.avatar}
                      </div>
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-app-card"
                        style={{ backgroundColor: getOnlineStatusColor(user.onlineStatus) }}
                      />
                    </div>
                    <div>
                      <div className="font-dm text-text-primary text-sm font-medium">
                        {user.displayName}
                        {user.id === currentUserId && (
                          <span className="ml-2 text-xs text-accent">(You)</span>
                        )}
                      </div>
                      <div className="font-dm text-text-dim text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-dm text-text-mid text-sm font-mono">
                    {user.username}
                  </span>
                </td>
                {showPasswords && (
                  <td className="px-5 py-4">
                    <span className="font-dm text-status-amber text-sm font-mono">
                      {user.password}
                    </span>
                  </td>
                )}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-dim">{getRoleIcon(user.role)}</span>
                    <Badge
                      label={getRoleDisplayLabel(user.role)}
                      color={getRoleBadgeColor(user.role) as any}
                      size="sm"
                    />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge
                    label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    color={getStatusBadgeColor(user.status) as any}
                    size="sm"
                  />
                </td>
                <td className="px-5 py-4">
                  <span className="font-dm text-text-dim text-sm">
                    {formatDateTime(user.lastLoginAt)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg text-text-dim hover:text-text-primary hover:bg-app-surface transition-colors"
                      title="Edit user"
                    >
                      <Edit2 size={16} />
                    </button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 rounded-lg text-text-dim hover:text-status-red hover:bg-status-red/10 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
