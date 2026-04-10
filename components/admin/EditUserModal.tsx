'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { TeamUser, UpdateUserInput, TeamRole, UserStatus } from '@/lib/auth/authTypes'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: TeamUser | null
  onSubmit: (userId: string, input: UpdateUserInput) => Promise<{ success: boolean; error?: string }>
}

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'member', label: 'Team Member' },
  { value: 'viewer', label: 'Viewer' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

export function EditUserModal({ isOpen, onClose, user, onSubmit }: EditUserModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<TeamRole>('member')
  const [status, setStatus] = useState<UserStatus>('active')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName)
      setEmail(user.email)
      setPassword('')
      setRole(user.role)
      setStatus(user.status)
    }
  }, [user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError('')
    setIsLoading(true)

    const updates: UpdateUserInput = {
      displayName,
      email,
      role,
      status,
    }

    if (password) {
      updates.password = password
    }

    const result = await onSubmit(user.id, updates)

    setIsLoading(false)

    if (result.success) {
      handleClose()
    } else {
      setError(result.error || 'Failed to update user')
    }
  }

  const handleClose = () => {
    setError('')
    setPassword('')
    onClose()
  }

  if (!user) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Team Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-status-red/10 border border-status-red/20">
            <span className="text-sm text-status-red font-dm">{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-app-surface rounded-lg border border-app-border">
          <div className="w-10 h-10 rounded-full bg-app-card border border-app-border flex items-center justify-center font-syne font-bold text-text-primary text-sm">
            {user.avatar}
          </div>
          <div>
            <div className="font-dm text-text-primary text-sm font-medium">@{user.username}</div>
            <div className="font-dm text-text-dim text-xs">Created {new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="New Password"
          type="text"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Only fill if changing password"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Role"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value as TeamRole)}
          />

          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-app-border">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
