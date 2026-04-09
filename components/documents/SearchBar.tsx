'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  query: string
  setQuery: (query: string) => void
  onClear?: () => void
}

export function SearchBar({ query, setQuery, onClear }: SearchBarProps) {
  const handleClear = () => {
    setQuery('')
    onClear?.()
  }

  return (
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4" />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Search 500 documents — try "term sheet", "valuation", "NDA", "meeting notes"...'
        className="w-full bg-app-card border border-app-border rounded-lg pl-10 pr-4 py-3.5 text-text-primary font-dm text-sm placeholder:text-text-dim focus:border-accent-border focus:outline-none transition-colors"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
