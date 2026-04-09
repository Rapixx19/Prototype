'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'

const STATS = [
  { label: 'Total Documents', value: '500', sub: 'Across 10 projects' },
  { label: 'Synced Today', value: '12', sub: 'Since 07:14' },
  { label: 'Review Queue', value: '7', sub: 'Low confidence' },
  { label: 'Next Sync', value: '14 min', sub: 'Delta query' },
]

interface RecentFile {
  name: string
  project: string
  type: string
  source: string
  syncedAt: string
  status: 'indexed' | 'review'
}

const RECENT_FILES: RecentFile[] = [
  { name: 'Term Sheet v4.pdf', project: 'Harbour Gate', type: 'Financial', source: 'OneDrive', syncedAt: '07:14', status: 'indexed' },
  { name: 'Operator Call Notes.docx', project: 'Nordic Hospitality', type: 'Meeting Note', source: 'OneDrive', syncedAt: '07:12', status: 'indexed' },
  { name: 'Valuation Memo Feb25.pdf', project: 'Alpine Heritage', type: 'Financial', source: 'OneDrive', syncedAt: '07:10', status: 'review' },
  { name: 'Site Visit Photos.zip', project: 'Mediterranean', type: 'Meeting Note', source: 'OneDrive', syncedAt: '07:08', status: 'indexed' },
  { name: 'Feasibility Draft v1.pdf', project: 'Northern Energy', type: 'Report', source: 'OneDrive', syncedAt: '07:05', status: 'indexed' },
  { name: 'Planning Consent.pdf', project: 'Urban Regen', type: 'Legal', source: 'OneDrive', syncedAt: '07:02', status: 'indexed' },
  { name: 'Contact Sheet.xlsx', project: 'Atlantic Residential', type: 'Correspondence', source: 'OneDrive', syncedAt: '06:58', status: 'indexed' },
  { name: 'Regulatory Notice.pdf', project: 'Coastal Leisure', type: 'Legal', source: 'OneDrive', syncedAt: '06:55', status: 'indexed' },
  { name: 'Due Diligence Report.pdf', project: 'Harbour Gate', type: 'Report', source: 'OneDrive', syncedAt: '06:52', status: 'indexed' },
  { name: 'Loan Agreement Draft.pdf', project: 'Nordic Hospitality', type: 'Legal', source: 'OneDrive', syncedAt: '06:48', status: 'indexed' },
]

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

export function SyncProgress() {
  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-app-card border border-app-border rounded-lg p-4"
          >
            <div className="font-syne font-bold text-text-primary text-2xl">
              {value}
            </div>
            <div className="font-dm text-text-mid text-sm mt-1">{label}</div>
            <div className="font-dm text-text-dim text-xs mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Files Table */}
      <div className="bg-app-card border border-app-border rounded-lg p-5">
        <div className="mb-4">
          <SectionLabel>Recently Synced Files</SectionLabel>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border">
                <th className="text-left font-dm text-text-dim text-xs font-medium pb-3">
                  File Name
                </th>
                <th className="text-left font-dm text-text-dim text-xs font-medium pb-3">
                  Project
                </th>
                <th className="text-left font-dm text-text-dim text-xs font-medium pb-3">
                  Type
                </th>
                <th className="text-left font-dm text-text-dim text-xs font-medium pb-3">
                  Source
                </th>
                <th className="text-left font-dm text-text-dim text-xs font-medium pb-3">
                  Synced At
                </th>
                <th className="text-left font-dm text-text-dim text-xs font-medium pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {RECENT_FILES.map((file, i) => (
                <tr
                  key={`${file.name}-${i}`}
                  className="border-b border-app-border last:border-0 hover:bg-app-surface transition-colors"
                >
                  <td className="py-3 pr-4">
                    <span className="font-dm text-text-primary text-sm">
                      {file.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-dm text-text-mid text-sm">
                      {file.project}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      label={file.type}
                      color={getTypeBadgeColor(file.type)}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-dm text-text-dim text-sm">
                      {file.source}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-dm text-text-dim text-sm">
                      {file.syncedAt}
                    </span>
                  </td>
                  <td className="py-3">
                    {file.status === 'indexed' ? (
                      <span className="font-dm text-xs text-status-green">
                        ✓ Indexed
                      </span>
                    ) : (
                      <span className="font-dm text-xs text-status-amber">
                        ⚑ Review Required
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
