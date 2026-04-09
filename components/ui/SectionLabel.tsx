import { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="text-xs font-dm font-semibold text-gold tracking-widest uppercase">
      {children}
    </span>
  )
}
