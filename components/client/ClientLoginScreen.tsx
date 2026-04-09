'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { loginClient } from '@/lib/clientAuth'
import { startSession } from '@/lib/sessionTracker'
import { setRole } from '@/lib/auth'

export function ClientLoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 800))

    const account = loginClient(email, password)
    if (!account) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    // Start session tracking
    startSession(account.id, account.name, account.email)

    // Set role to owner so client sees full prototype
    setRole('owner')

    router.push('/dashboard')
  }

  return (
    <div
      className="min-h-screen bg-app-bg flex items-center justify-center p-4"
      style={{
        backgroundImage: 'radial-gradient(circle, #1A2035 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="w-full max-w-sm bg-app-card border border-app-border rounded-2xl p-8 border-t-2 border-t-accent">
        {/* Logo */}
        <div className="text-center">
          <div className="font-syne font-bold text-accent text-xl tracking-widest">
            VECTERAI
          </div>
          <div className="font-dm text-text-dim text-sm mt-1">Client Portal</div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gold/30" />

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-syne font-bold text-text-primary text-2xl">Welcome</h1>
          <p className="font-dm text-text-mid text-sm mt-1">
            Sign in to access your VecterAI platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-dm text-text-dim text-xs uppercase tracking-widest mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@vecterai.io"
              className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 font-dm text-text-primary text-sm focus:border-accent-border focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-dm text-text-dim text-xs uppercase tracking-widest mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 pr-10 font-dm text-text-primary text-sm focus:border-accent-border focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-app-border bg-app-surface text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
            />
            <span className="font-dm text-text-mid text-sm">Remember me</span>
          </label>

          {/* Error message */}
          {error && (
            <div className="bg-red-950/30 border border-red-900/30 rounded-xl px-4 py-3 font-dm text-status-red text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-accent text-app-bg font-dm font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Prototype disclaimer */}
        <div className="mt-6 flex items-start gap-3 bg-amber-950/20 border border-amber-900/30 rounded-xl px-4 py-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-status-amber" />
          </div>
          <div>
            <div className="font-dm font-semibold text-status-amber text-xs mb-1">
              Prototype Demo
            </div>
            <div className="font-dm text-status-amber/80 text-xs leading-relaxed">
              This is a prototype demonstration only. All data is synthetic.
              This is not a tailored or production solution — it is built to
              showcase the potential of the VecterAI Knowledge OS platform.
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-6">
          <div className="font-dm text-text-dim text-xs">
            Access provided by VecterAI Consulting
          </div>
          <div className="font-dm text-text-dim text-xs mt-0.5">vecterai.io</div>
        </div>
      </div>
    </div>
  )
}
