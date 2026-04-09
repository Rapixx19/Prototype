'use client'

import { useState, useEffect } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'

interface QueueItem {
  name: string
  type: string
}

const QUEUE_ITEMS: QueueItem[] = [
  { name: 'Harbour Gate — Term Sheet v4.pdf', type: 'Financial' },
  { name: 'Nordic — Operator Call Notes 09Apr.docx', type: 'Meeting Note' },
  { name: 'Alpine — Valuation Memo Feb25.pdf', type: 'Financial' },
  { name: 'Mediterranean — Site Visit Photos.jpg', type: 'Meeting Note' },
  { name: 'Energy — Feasibility Draft v1.pdf', type: 'Report' },
  { name: 'Urban Regen — Planning Consent.pdf', type: 'Legal' },
  { name: 'Atlantic — Contact Sheet.xlsx', type: 'Correspondence' },
  { name: 'Coastal — Regulatory Notice.pdf', type: 'Legal' },
]

const STEPS = ['Classifying...', 'Extracting entities...', 'Summarising...', 'Indexing...']

function getTypeBadgeColor(type: string): 'accent' | 'green' | 'blue' | 'purple' | 'amber' {
  switch (type) {
    case 'Financial':
      return 'green'
    case 'Legal':
      return 'purple'
    case 'Meeting Note':
      return 'blue'
    case 'Report':
      return 'accent'
    default:
      return 'amber'
  }
}

export function IngestQueue() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [completedItems, setCompletedItems] = useState<QueueItem[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          // Move current item to completed and advance to next
          setCompletedItems((prev) => {
            const completed = QUEUE_ITEMS[currentIndex]
            return [completed, ...prev].slice(0, 3) // Keep only last 3 completed
          })
          setCurrentIndex((i) => (i + 1) % QUEUE_ITEMS.length)
          return 0
        }
        return s + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentIndex])

  const currentItem = QUEUE_ITEMS[currentIndex]
  const queuedItems = QUEUE_ITEMS.slice(currentIndex + 1, currentIndex + 4).concat(
    currentIndex + 4 > QUEUE_ITEMS.length
      ? QUEUE_ITEMS.slice(0, (currentIndex + 4) % QUEUE_ITEMS.length)
      : []
  ).slice(0, 3)

  return (
    <div className="bg-app-card border border-app-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Ingestion Queue</SectionLabel>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
          <span className="font-dm text-text-dim text-xs">Live</span>
        </span>
      </div>

      {/* Completed items */}
      {completedItems.length > 0 && (
        <div className="space-y-2 mb-4 pb-4 border-b border-app-border">
          {completedItems.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex items-center gap-3 py-2 px-3 bg-status-green/5 border border-status-green/20 rounded"
            >
              <span className="text-status-green text-sm">✓</span>
              <span className="font-dm text-text-mid text-xs truncate flex-1">
                {item.name}
              </span>
              <Badge label={item.type} color="green" size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Currently processing */}
      <div className="mb-4">
        <div className="flex items-start gap-3 py-3 px-3 bg-accent-dim border border-accent-border rounded">
          <Spinner className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-dm text-text-primary text-sm truncate">
              {currentItem.name}
            </div>
            <div className="font-dm text-accent text-xs mt-1">{STEPS[step]}</div>
          </div>
          <Badge label={currentItem.type} color={getTypeBadgeColor(currentItem.type)} size="sm" />
        </div>
      </div>

      {/* Queue */}
      <div className="space-y-2">
        {queuedItems.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center gap-3 py-2 px-3 bg-app-surface rounded"
          >
            <span className="font-dm text-text-dim text-xs w-4">{i + 1}</span>
            <span className="font-dm text-text-mid text-xs truncate flex-1">
              {item.name}
            </span>
            <Badge label={item.type} color="dim" size="sm" />
          </div>
        ))}
      </div>

      {/* Queue status */}
      <div className="mt-4 pt-4 border-t border-app-border">
        <div className="flex items-center justify-between">
          <span className="font-dm text-text-dim text-xs">
            {QUEUE_ITEMS.length} items in queue
          </span>
          <span className="font-dm text-text-dim text-xs">~2 min remaining</span>
        </div>
      </div>
    </div>
  )
}
