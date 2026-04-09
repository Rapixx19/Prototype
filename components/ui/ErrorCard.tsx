import { AlertTriangle } from 'lucide-react'

interface ErrorCardProps {
  message?: string
  onRetry?: () => void
}

export function ErrorCard({
  message = 'Something went wrong',
  onRetry,
}: ErrorCardProps) {
  return (
    <div className="bg-status-red/10 border border-status-red/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-status-red flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-dm text-status-red text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-dm text-text-mid hover:text-text-primary transition-colors underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
