'use client'

import { useState, useEffect } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { generateProjectSynthesis } from '@/lib/claude'
import type { Project } from '@/lib/types'

interface ProjectSynthesisProps {
  project: Project
}

export function ProjectSynthesis({ project }: ProjectSynthesisProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    generateProjectSynthesis(project).then(r => {
      if (!cancelled) {
        setText(r)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [project])

  return (
    <div className="bg-app-card border border-app-border border-t-2 border-t-gold rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>
          Project Synthesis — AI generated from {project.documentIds.length} linked documents
        </SectionLabel>
        <span className="font-dm text-text-dim text-xs">Updated: Today 03:00</span>
      </div>
      <div className="h-0.5 w-full bg-gold/20 mb-4" />
      {loading ? (
        <AIGenerating label={`Reading ${project.documentIds.length} documents...`} />
      ) : (
        <p className="font-dm font-light text-text-mid leading-relaxed text-sm italic fade-in">
          {text}
        </p>
      )}
    </div>
  )
}
