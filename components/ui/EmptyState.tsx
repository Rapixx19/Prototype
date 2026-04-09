import { FileText } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
}

export function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-app-border flex items-center justify-center mb-4">
        {icon || <FileText className="w-6 h-6 text-text-dim" />}
      </div>
      <h3 className="font-syne font-semibold text-text-primary text-base mb-1">
        {title}
      </h3>
      {description && (
        <p className="font-dm text-text-mid text-sm max-w-sm">
          {description}
        </p>
      )}
    </div>
  )
}
