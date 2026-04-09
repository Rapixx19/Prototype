'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  isActive?: boolean
}

export function NavItem({ href, icon, label, isActive = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-dm transition-colors
        ${
          isActive
            ? 'bg-accent-dim text-accent border border-accent-border'
            : 'text-text-mid hover:text-text-primary hover:bg-app-card2'
        }
      `}
    >
      <span className={isActive ? 'text-accent' : 'text-text-dim'}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
