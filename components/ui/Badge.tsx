interface BadgeProps {
  label: string
  color?: 'accent' | 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'dim'
  size?: 'sm' | 'md'
}

const colorClasses = {
  accent: 'bg-accent-dim border-accent-border text-accent',
  green: 'bg-status-green/15 border-status-green/30 text-status-green',
  red: 'bg-status-red/15 border-status-red/30 text-status-red',
  amber: 'bg-status-amber/15 border-status-amber/30 text-status-amber',
  blue: 'bg-status-blue/15 border-status-blue/30 text-status-blue',
  purple: 'bg-status-purple/15 border-status-purple/30 text-status-purple',
  dim: 'bg-app-border/50 border-app-border text-text-dim',
}

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
}

export function Badge({ label, color = 'accent', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-dm font-semibold border rounded
        ${colorClasses[color]}
        ${sizeClasses[size]}
      `}
    >
      {label}
    </span>
  )
}
