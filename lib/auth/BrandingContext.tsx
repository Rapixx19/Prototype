'use client'

import type { ReactNode } from 'react'

export function BrandingProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useBranding() {
  return null
}

export function applyBranding() {}

export function resetBranding() {}
