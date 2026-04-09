'use client'

import { useState, useEffect } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { generateDocumentSummary } from '@/lib/claude'
import type { Document } from '@/lib/types'

interface AISummaryProps {
  doc: Document
}

export function AISummary({ doc }: AISummaryProps) {
  const [bullets, setBullets] = useState<string[]>([])
  const [narrative, setNarrative] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    generateDocumentSummary(doc).then(result => {
      if (!cancelled) {
        setBullets(result.bullets)
        setNarrative(result.narrative)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [doc])

  return (
    <div className="bg-app-card border border-app-border border-t-2 border-t-accent rounded-lg p-6 mb-4">
      <SectionLabel>AI Summary · Generated from document content</SectionLabel>
      <div className="h-0.5 w-full bg-accent/20 mt-3 mb-4" />
      {loading ? (
        <AIGenerating label="Analysing document..." />
      ) : (
        <div className="fade-in space-y-4">
          {/* Bullet points */}
          <ul className="space-y-2">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-accent mt-1 flex-shrink-0">—</span>
                <span className="font-dm text-text-mid text-sm leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
          {/* Narrative */}
          <p className="font-dm font-light text-text-dim text-sm italic leading-relaxed border-t border-app-border pt-4">
            {narrative}
          </p>
        </div>
      )}
    </div>
  )
}
