'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { login, isAuthenticated, isAdminSession, initStorage } from '@/lib/auth/storage'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    initStorage()
    if (isAdminSession()) {
      router.push('/admin')
    } else if (isAuthenticated()) {
      router.push('/dashboard')
    } else {
      setChecking(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 400))

    const result = login(username, password)

    if (!result.success) {
      setError('Invalid username or password.')
      setIsLoading(false)
      return
    }

    if (result.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-app-bg flex items-center justify-center p-8"
      style={{
        backgroundImage: 'radial-gradient(circle, #1A2035 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-syne font-bold text-accent text-2xl tracking-widest mb-1">
            VECTERAI
          </div>
          <div className="font-dm text-text-dim text-sm tracking-widest mb-6">
            KNOWLEDGE OS
          </div>
          <div className="font-syne font-bold text-text-primary text-2xl">
            Sign In
          </div>
          <div className="font-dm text-text-mid text-sm mt-2">
            Enter your credentials to continue
          </div>
        </div>

        <div className="bg-app-card border border-app-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-mid text-sm font-dm mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-lg pl-11 pr-4 py-3 text-text-primary font-dm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter username or email"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-mid text-sm font-dm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-lg px-4 py-3 pr-11 text-text-primary font-dm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-mid transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm font-dm bg-red-400/10 border border-red-400/20 rounded-full px-4 py-2 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-dm font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <span className="text-text-dim text-xs font-dm">
            Admin access: use your VecterAI credentials
          </span>
        </div>
      </div>
    </div>
  )
}
