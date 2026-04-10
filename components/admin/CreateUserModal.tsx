'use client'

import { useState, FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { CreateUserInput, TeamRole } from '@/lib/auth/authTypes'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateUserInput) => Promise<{ success: boolean; error?: string }>
}

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'member', label: 'Team Member' },
  { value: 'viewer', label: 'Viewer' },
]

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<TeamRole>('member')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await onSubmit({
      displayName,
      username,
      email,
      password,
      role,
    })

    setIsLoading(false)

    if (result.success) {
      handleClose()
    } else {
      setError(result.error || 'Failed to create user')
    }
  }

  const handleClose = () => {
    setDisplayName('')
    setUsername('')
    setEmail('')
    setPassword('')
    setRole('member')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Team Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-status-red/10 border border-status-red/20">
            <span className="text-sm text-status-red font-dm">{error}</span>
          </div>
        )}

        <Input
          label="Display Name"
          placeholder="John Doe"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <Input
          label="Username"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
          required
          hint="Lowercase, no spaces"
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@vecterai.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="text"
          placeholder="securepassword123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          hint="Minimum 6 characters"
        />

        <Select
          label="Role"
          options={roleOptions}
          value={role}
          onChange={(e) => setRole(e.target.value as TeamRole)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-app-border">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            Add User
          </Button>
        </div>
      </form>
    </Modal>
  )
}
