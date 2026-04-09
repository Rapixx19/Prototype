'use client'

import { useEffect } from 'react'
import { ErrorCard } from '@/components/ui/ErrorCard'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="p-8">
      <div className="max-w-md">
        <h2 className="font-syne font-bold text-text-primary text-xl mb-4">
          Something went wrong
        </h2>
        <ErrorCard
          message={error.message || 'An unexpected error occurred. Please try again.'}
          onRetry={reset}
        />
        {error.digest && (
          <p className="mt-4 font-dm text-text-dim text-xs">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
