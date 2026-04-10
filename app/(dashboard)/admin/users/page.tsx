'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Users, Shield, UserCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import { UserTable } from '@/components/admin/UserTable'
import { CreateUserModal } from '@/components/admin/CreateUserModal'
import { EditUserModal } from '@/components/admin/EditUserModal'
import { DeleteUserModal } from '@/components/admin/DeleteUserModal'
import type { TeamUser } from '@/lib/auth/authTypes'

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAdmin, isLoading, users, onlineCount, addUser, editUser, removeUser, logPasswordsViewed, refreshUsers } = useAuth()

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null)

  useEffect(() => {
    refreshUsers()
  }, [refreshUsers])

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isLoading, isAdmin, router])

  const handleEdit = (u: TeamUser) => {
    setSelectedUser(u)
    setEditModalOpen(true)
  }

  const handleDelete = (u: TeamUser) => {
    setSelectedUser(u)
    setDeleteModalOpen(true)
  }

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const adminCount = users.filter(u => u.role === 'admin').length
  const memberCount = users.filter(u => u.role === 'member').length
  const viewerCount = users.filter(u => u.role === 'viewer').length

  return (
    <div className="p-4 sm:p-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <SectionLabel>Admin Panel</SectionLabel>
          <h1 className="font-syne font-bold text-text-primary text-2xl sm:text-3xl mt-2">
            Team Members
          </h1>
          <p className="font-dm text-text-mid text-sm mt-1">
            Manage team accounts, roles, and access
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <UserPlus size={16} />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Users size={20} className="text-accent" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{users.length}</div>
              <div className="font-dm text-text-dim text-sm">Total Users</div>
            </div>
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-green/15 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-status-green" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{onlineCount}</div>
              <div className="font-dm text-text-dim text-sm">Online Now</div>
            </div>
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-purple/15 flex items-center justify-center">
              <Shield size={20} className="text-status-purple" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{adminCount}</div>
              <div className="font-dm text-text-dim text-sm">Admins</div>
            </div>
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-blue/15 flex items-center justify-center">
              <UserCheck size={20} className="text-status-blue" />
            </div>
            <div>
              <div className="font-syne font-bold text-text-primary text-2xl">{memberCount + viewerCount}</div>
              <div className="font-dm text-text-dim text-sm">Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        currentUserId={user?.id || ''}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPasswordsViewed={logPasswordsViewed}
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={addUser}
      />

      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSubmit={editUser}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onConfirm={removeUser}
      />
    </div>
  )
}
