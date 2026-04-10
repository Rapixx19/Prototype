'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login({ username, password })

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-status-red/10 border border-status-red/20">
          <AlertCircle size={16} className="text-status-red flex-shrink-0" />
          <span className="text-sm text-status-red font-dm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">
            <User size={18} />
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg font-dm text-sm
              bg-app-surface border border-app-border
              text-text-primary placeholder:text-text-dim
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-colors duration-200"
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-lg font-dm text-sm
              bg-app-surface border border-app-border
              text-text-primary placeholder:text-text-dim
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-colors duration-200"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-mid transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
      >
        Sign In
      </Button>

      <div className="pt-4 border-t border-app-border">
        <p className="text-xs text-text-dim font-dm text-center mb-3">
          Demo Accounts
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-dm">
          <div className="p-2 rounded bg-app-surface border border-app-border">
            <span className="text-accent">admin</span>
            <span className="text-text-dim"> / </span>
            <span className="text-text-mid">admin123</span>
          </div>
          <div className="p-2 rounded bg-app-surface border border-app-border">
            <span className="text-accent">jthompson</span>
            <span className="text-text-dim"> / </span>
            <span className="text-text-mid">portfolio2025</span>
          </div>
          <div className="p-2 rounded bg-app-surface border border-app-border">
            <span className="text-accent">smorris</span>
            <span className="text-text-dim"> / </span>
            <span className="text-text-mid">deals2025</span>
          </div>
          <div className="p-2 rounded bg-app-surface border border-app-border">
            <span className="text-accent">viewer</span>
            <span className="text-text-dim"> / </span>
            <span className="text-text-mid">view2025</span>
          </div>
        </div>
      </div>
    </form>
  )
}
