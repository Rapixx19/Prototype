import { Spinner } from './Spinner'

interface AIGeneratingProps {
  label?: string
}

export function AIGenerating({ label = 'Generating intelligence...' }: AIGeneratingProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <Spinner />
      <span className="text-text-dim text-sm font-dm animate-pulse">{label}</span>
    </div>
  )
}
