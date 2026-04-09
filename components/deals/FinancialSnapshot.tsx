'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import type { Project } from '@/lib/types'

interface FinancialSnapshotProps {
  project: Project
}

function parseValueToNumber(valueStr: string): number {
  const cleaned = valueStr.replace(/[£$€,\s]/g, '')
  const multiplier = cleaned.toLowerCase().includes('m') ? 1_000_000
    : cleaned.toLowerCase().includes('b') ? 1_000_000_000
    : cleaned.toLowerCase().includes('k') ? 1_000
    : 1
  const num = parseFloat(cleaned.replace(/[a-zA-Z]/g, ''))
  return isNaN(num) ? 0 : num * multiplier
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `£${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`
  return `£${value.toFixed(0)}`
}

export function FinancialSnapshot({ project }: FinancialSnapshotProps) {
  const totalValue = project.valueRaw
  const equityValue = parseValueToNumber(project.equity)
  const debtValue = totalValue - equityValue

  const equityPercent = totalValue > 0 ? Math.round((equityValue / totalValue) * 100) : 0
  const debtPercent = totalValue > 0 ? Math.round((debtValue / totalValue) * 100) : 0

  const irrValue = parseFloat(project.irr.replace('%', ''))
  const irrStatus = irrValue >= 15 ? 'On Track' : irrValue >= 10 ? 'Below Target' : 'At Risk'
  const irrColor = irrValue >= 15 ? 'text-status-green' : irrValue >= 10 ? 'text-status-amber' : 'text-status-red'
  const irrDotColor = irrValue >= 15 ? 'bg-status-green' : irrValue >= 10 ? 'bg-status-amber' : 'bg-status-red'

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Financial Overview</SectionLabel>
        <span className="text-xs font-dm text-text-dim bg-accent-dim border border-accent-border rounded px-2 py-0.5">
          Owner Only
        </span>
      </div>

      {/* Value breakdown */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <div className="font-dm text-xs text-text-dim mb-1">Total Value</div>
          <div className="font-syne font-bold text-text-primary text-xl">{project.value}</div>
          <div className="h-2 bg-accent/30 rounded-full mt-2" />
          <div className="font-dm text-xs text-text-dim mt-1">100%</div>
        </div>
        <div>
          <div className="font-dm text-xs text-text-dim mb-1">Equity</div>
          <div className="font-syne font-bold text-status-green text-xl">{project.equity}</div>
          <div className="h-2 bg-app-border rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-status-green rounded-full transition-all duration-500"
              style={{ width: `${equityPercent}%` }}
            />
          </div>
          <div className="font-dm text-xs text-text-dim mt-1">{equityPercent}%</div>
        </div>
        <div>
          <div className="font-dm text-xs text-text-dim mb-1">Debt</div>
          <div className="font-syne font-bold text-status-amber text-xl">{formatCurrency(debtValue)}</div>
          <div className="h-2 bg-app-border rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-status-amber rounded-full transition-all duration-500"
              style={{ width: `${debtPercent}%` }}
            />
          </div>
          <div className="font-dm text-xs text-text-dim mt-1">{debtPercent}%</div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-app-border my-4" />

      {/* IRR and dates */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="font-dm text-xs text-text-dim mb-1">Target IRR</div>
          <div className="font-syne font-bold text-text-primary text-xl">{project.irr}</div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`w-2 h-2 rounded-full ${irrDotColor}`} />
            <span className={`font-dm text-xs ${irrColor}`}>{irrStatus}</span>
          </div>
        </div>
        <div>
          <div className="font-dm text-xs text-text-dim mb-1">Started</div>
          <div className="font-syne font-bold text-text-primary text-xl">{project.started}</div>
        </div>
        <div>
          <div className="font-dm text-xs text-text-dim mb-1">Last Activity</div>
          <div className="font-syne font-bold text-text-primary text-xl">{project.lastActivity}</div>
        </div>
      </div>
    </div>
  )
}
