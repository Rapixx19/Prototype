interface ConfidenceBarProps {
  value: number
  showLabel?: boolean
}

export function ConfidenceBar({ value, showLabel = false }: ConfidenceBarProps) {
  const percentage = Math.round(value * 100)

  let colorClass = 'bg-status-green'
  if (value < 0.8) {
    colorClass = 'bg-status-red'
  } else if (value < 0.9) {
    colorClass = 'bg-status-amber'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-app-border rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-dm text-text-dim min-w-[36px]">{percentage}%</span>
      )}
    </div>
  )
}
