export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-4 h-4 border-2 border-app-border border-t-accent rounded-full animate-spin ${className}`}
    />
  )
}
