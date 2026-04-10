'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { TeamUser } from '@/lib/auth/authTypes'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: TeamUser | null
  onConfirm: (userId: string) => Promise<{ success: boolean; error?: string }>
}

export function DeleteUserModal({ isOpen, onClose, user, onConfirm }: DeleteUserModalProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) return

    setError('')
    setIsLoading(true)

    const result = await onConfirm(user.id)

    setIsLoading(false)

    if (result.success) {
      onClose()
    } else {
      setError(result.error || 'Failed to delete user')
    }
  }

  if (!user) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team Member" size="sm">
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-status-red/10 border border-status-red/20">
            <span className="text-sm text-status-red font-dm">{error}</span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-status-red/15 flex items-center justify-center">
            <AlertTriangle size={20} className="text-status-red" />
          </div>
          <div>
            <p className="font-dm text-text-primary text-sm">
              Are you sure you want to delete <strong>{user.displayName}</strong>?
            </p>
            <p className="font-dm text-text-dim text-sm mt-1">
              This action cannot be undone. The user will lose all access to the system.
            </p>
          </div>
        </div>

        <div className="p-3 bg-app-surface rounded-lg border border-app-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-app-card border border-app-border flex items-center justify-center font-syne font-bold text-text-primary text-xs">
              {user.avatar}
            </div>
            <div>
              <div className="font-dm text-text-primary text-sm">{user.displayName}</div>
              <div className="font-dm text-text-dim text-xs">@{user.username}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-app-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={isLoading}
          >
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  )
}
