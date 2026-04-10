'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  Plus,
  Users,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  X,
  Check,
  AlertCircle,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import {
  isAdminSession,
  logout,
  getAllAccounts,
  createAccount,
  deleteAccount,
} from '@/lib/auth/storage'
import type { UserAccount } from '@/lib/auth/types'

export default function AdminPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [showForm, setShowForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isAdminSession()) {
      router.push('/login')
      return
    }
    setChecking(false)
    setAccounts(getAllAccounts())
  }, [router])

  const refreshAccounts = () => setAccounts(getAllAccounts())

  const handleSignOut = () => {
    logout()
    router.push('/login')
  }

  const openCreate = () => {
    setUsername('')
    setPassword('')
    setDisplayName('')
    setShowForm(true)
  }

  const handleSave = () => {
    if (!username || !password || !displayName) return
    createAccount({
      username,
      password,
      displayName,
      active: true,
    })
    setShowForm(false)
    refreshAccounts()
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteAccount(deleteId)
      setDeleteId(null)
      refreshAccounts()
    }
  }

  const copyCredentials = (account: UserAccount) => {
    navigator.clipboard.writeText(`Username: ${account.username}\nPassword: ${account.password}`)
    setCopied(account.id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (checking) return null

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="h-14 bg-app-surface border-b border-app-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent" />
          <span className="font-syne font-bold text-accent tracking-widest text-sm">ADMIN PANEL</span>
          <span className="text-text-dim text-xs font-dm ml-2">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs font-dm text-text-dim hover:text-text-primary transition-colors px-3 py-1.5 border border-app-border rounded hover:border-accent-border"
          >
            <LayoutDashboard className="w-4 h-4" />
            View Dashboard
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-dm text-text-dim hover:text-red-400 transition-colors px-3 py-1.5 border border-app-border rounded hover:border-red-400/50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-start gap-3 bg-amber-950/20 border border-amber-800/30 rounded-xl px-5 py-4">
          <AlertCircle className="w-5 h-5 text-status-amber flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-syne font-bold text-status-amber text-sm tracking-wide mb-0.5">
              This is a prototype and not a tailored solution
            </div>
            <div className="font-dm text-amber-300/60 text-xs leading-relaxed">
              This system is a demonstration build for prospective clients.
              Data is stored in browser localStorage — not a production database.
              Do not use real confidential data in this environment.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-bold text-text-primary text-2xl">User Accounts</h1>
            <p className="font-dm text-text-dim text-sm mt-1">Manage access credentials</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-dm text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Account
          </button>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-app-card border border-app-border rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
                  <span className="font-syne font-bold text-accent text-sm">
                    {account.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-dm text-text-primary font-medium">{account.displayName}</div>
                  <div className="font-dm text-text-dim text-xs">{account.username}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCredentials(account)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-bg border border-app-border text-text-mid hover:text-text-primary hover:border-accent-border transition-colors text-xs font-dm"
                >
                  {copied === account.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-status-green" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Login
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDeleteId(account.id)}
                  className="p-2 rounded-lg bg-app-bg border border-app-border text-text-dim hover:text-red-400 hover:border-red-400/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-text-dim mx-auto mb-3" />
            <div className="font-dm text-text-mid">No accounts yet</div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-app-surface border border-app-border rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-bold text-text-primary text-xl">New Account</h2>
              <button onClick={() => setShowForm(false)} className="text-text-dim hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-text-dim text-xs font-dm mb-1">Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-text-primary font-dm text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-text-dim text-xs font-dm mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 pr-10 text-text-primary font-dm text-sm focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-text-dim text-xs font-dm mb-1">Display Name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-text-primary font-dm text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-lg border border-app-border text-text-mid hover:text-text-primary font-dm text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!username || !password || !displayName}
                className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-dm text-sm transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-app-surface border border-app-border rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="font-syne font-bold text-text-primary">Delete Account</div>
                <div className="font-dm text-text-dim text-sm">
                  {accounts.find((a) => a.id === deleteId)?.displayName}
                </div>
              </div>
            </div>
            <p className="font-dm text-text-mid text-sm mb-6">
              This action cannot be undone. The account will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-app-border text-text-mid hover:text-text-primary font-dm text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-dm text-sm transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
