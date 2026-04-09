'use client'

import { useState, useEffect } from 'react'
import { generateMorningBriefing } from '@/lib/claude'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Role } from '@/lib/types'

interface MorningBriefingProps {
  role: Role
}

export function MorningBriefing({ role }: MorningBriefingProps) {
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    generateMorningBriefing(role).then((result) => {
      if (!cancelled) {
        setText(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [role])

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-6 mb-6 border-t-2 border-t-accent">
      <SectionLabel>AI Intelligence &middot; Generated at 07:00</SectionLabel>
      <div className="mt-3 min-h-[60px]">
        {loading ? (
          <AIGenerating label="Generating your morning briefing..." />
        ) : (
          <p className="font-dm font-light text-text-mid leading-relaxed text-sm italic fade-in">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}
