import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-dm text-text-mid mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2.5 rounded-lg font-dm text-sm
            bg-app-surface border border-app-border
            text-text-primary placeholder:text-text-dim
            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-status-red focus:border-status-red focus:ring-status-red/30' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-status-red font-dm">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-text-dim font-dm">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
