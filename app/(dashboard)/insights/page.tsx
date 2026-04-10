'use client'

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, TrendingUp, Clock, Check, X, ChevronDown, ChevronUp, Sparkles, Plus } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { AIGenerating } from '@/components/ui/AIGenerating'
import { INSIGHTS, getProject, getContact } from '@/lib/data'
import { generateInsightAnalysis } from '@/lib/claude'
import { getRole, canAccess } from '@/lib/auth'
import type { Role, Severity, Insight } from '@/lib/types'

type InsightWithState = Insight & { dismissed?: boolean; resolved?: boolean }

const SEVERITY_TABS: (Severity | 'all')[] = ['all', 'high', 'medium', 'low']
const INSIGHT_TYPES = ['All Types', 'Deadline Risk', 'Valuation Discrepancy', 'Unsigned Agreement', 'Relationship Gap', 'Project Stagnation', 'Pattern Detected', 'Missing Follow-Up', 'Document Review Required']

function useRole() {
  const subscribe = useCallback(() => () => {}, [])
  const getSnapshot = useCallback(() => getRole(), [])
  const getServerSnapshot = useCallback(() => 'owner' as Role, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function useMounted() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    onStoreChange()
    return () => {}
  }, [])
  const getSnapshot = useCallback(() => true, [])
  const getServerSnapshot = useCallback(() => false, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function severityColor(severity: Severity): 'red' | 'amber' | 'blue' {
  return severity === 'high' ? 'red' : severity === 'medium' ? 'amber' : 'blue'
}

function severityBorder(severity: Severity): string {
  return severity === 'high' ? 'border-l-status-red' : severity === 'medium' ? 'border-l-status-amber' : 'border-l-status-blue'
}

export default function InsightsPage() {
  const role = useRole()
  const mounted = useMounted()
  const router = useRouter()

  const [insights, setInsights] = useState<InsightWithState[]>(INSIGHTS.map(i => ({ ...i })))
  const [severityTab, setSeverityTab] = useState<Severity | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [expandedAnalysis, setExpandedAnalysis] = useState<Record<string, boolean>>({})
  const [analyses, setAnalyses] = useState<Record<string, string>>({})
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null)
  const [showResolved, setShowResolved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [taskModal, setTaskModal] = useState<Insight | null>(null)
  const [taskTitle, setTaskTitle] = useState('')

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const loadAnalysis = useCallback((insight: Insight) => {
    if (analyses[insight.id] || loadingAnalysis === insight.id) return
    setLoadingAnalysis(insight.id)
    generateInsightAnalysis(insight).then(result => {
      setAnalyses(prev => ({ ...prev, [insight.id]: result }))
      setLoadingAnalysis(null)
    }).catch(() => {
      setAnalyses(prev => ({ ...prev, [insight.id]: 'Analysis unavailable.' }))
      setLoadingAnalysis(null)
    })
  }, [analyses, loadingAnalysis])

  const toggleAnalysis = useCallback((insightId: string) => {
    setExpandedAnalysis(prev => ({ ...prev, [insightId]: !prev[insightId] }))
    const insight = insights.find(i => i.id === insightId)
    if (insight && !analyses[insightId]) loadAnalysis(insight)
  }, [insights, analyses, loadAnalysis])

  const dismissInsight = useCallback((id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, dismissed: true } : i))
    setToast('Insight dismissed')
  }, [])

  const resolveInsight = useCallback((id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, resolved: true } : i))
    setToast('Insight marked as resolved')
  }, [])

  const createTask = useCallback(() => {
    if (!taskModal || !taskTitle.trim()) return
    setToast(`Task created: ${taskTitle}`)
    setTaskModal(null)
    setTaskTitle('')
  }, [taskModal, taskTitle])

  if (!mounted) return null

  if (!canAccess(role, 'insights')) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle size={48} className="text-status-amber mx-auto mb-4" />
          <h2 className="font-syne font-bold text-text-primary text-xl mb-2">Access Restricted</h2>
          <p className="font-dm text-text-dim text-sm">The Insights Engine is available to Managing Partners only. Contact your administrator for access.</p>
          <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-accent-dim border border-accent-border text-accent rounded-lg font-dm text-sm hover:bg-accent/20 transition-colors">Return to Dashboard</button>
        </Card>
      </div>
    )
  }

  const activeInsights = insights.filter(i => !i.dismissed && !i.resolved)
  const resolvedInsights = insights.filter(i => i.resolved)

  const filteredInsights = activeInsights.filter(i => {
    if (severityTab !== 'all' && i.severity !== severityTab) return false
    if (typeFilter !== 'All Types' && i.type !== typeFilter) return false
    return true
  })

  const counts = {
    total: activeInsights.length,
    high: activeInsights.filter(i => i.severity === 'high').length,
    medium: activeInsights.filter(i => i.severity === 'medium').length,
    low: activeInsights.filter(i => i.severity === 'low').length,
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <SectionLabel>Intelligence Engine</SectionLabel>
        <h1 className="font-syne font-bold text-text-primary text-3xl mt-1">Portfolio Insights</h1>
        <p className="font-dm text-text-dim text-sm mt-1">AI-generated alerts requiring attention</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><div className="flex items-center gap-3"><TrendingUp className="text-accent" size={20} /><div><div className="font-dm text-text-dim text-xs">Total Active</div><div className="font-syne font-bold text-text-primary text-2xl">{counts.total}</div></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><AlertTriangle className="text-status-red" size={20} /><div><div className="font-dm text-text-dim text-xs">High Severity</div><div className="font-syne font-bold text-status-red text-2xl">{counts.high}</div></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><Clock className="text-status-amber" size={20} /><div><div className="font-dm text-text-dim text-xs">Medium Severity</div><div className="font-syne font-bold text-status-amber text-2xl">{counts.medium}</div></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><Check className="text-status-blue" size={20} /><div><div className="font-dm text-text-dim text-xs">Low Severity</div><div className="font-syne font-bold text-status-blue text-2xl">{counts.low}</div></div></div></Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {SEVERITY_TABS.map(tab => (
            <button key={tab} onClick={() => setSeverityTab(tab)} className={`px-4 py-2 text-sm font-dm rounded-lg transition-colors capitalize whitespace-nowrap ${severityTab === tab ? 'text-accent bg-accent-dim border border-accent-border' : 'text-text-dim hover:text-text-mid hover:bg-app-card'}`}>{tab === 'all' ? 'All' : tab}</button>
          ))}
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-app-card border border-app-border rounded-lg px-3 py-2 text-text-primary font-dm text-sm focus:border-accent-border focus:outline-none w-full sm:w-auto">
          {INSIGHT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filteredInsights.map(insight => {
          const proj = insight.projectId ? getProject(insight.projectId) : null
          const contact = insight.contactId ? getContact(insight.contactId) : null
          const isExpanded = expandedAnalysis[insight.id]
          return (
            <Card key={insight.id} className={`p-5 border-l-4 ${severityBorder(insight.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge label={insight.severity.toUpperCase()} color={severityColor(insight.severity)} size="sm" />
                    <span className="font-dm text-text-dim text-xs">{insight.type}</span>
                    <span className="font-dm text-text-dim text-xs">· {insight.generatedAt}</span>
                  </div>
                  <p className="font-dm text-text-primary text-sm leading-relaxed">{insight.body}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {proj && <button onClick={() => router.push(`/deals/${proj.id}`)} className="px-2 py-1 bg-accent-dim border border-accent-border rounded text-xs font-dm text-accent hover:bg-accent/20 transition-colors">{proj.name}</button>}
                    {contact && <button onClick={() => router.push(`/contacts/${contact.id}`)} className="px-2 py-1 bg-app-border/50 border border-app-border rounded text-xs font-dm text-text-mid hover:bg-app-border transition-colors">{contact.name}</button>}
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-app-border pt-4">
                <button onClick={() => toggleAnalysis(insight.id)} className="flex items-center gap-1 text-accent text-sm font-dm hover:opacity-80 transition-opacity mb-3"><Sparkles size={14} />View AI Analysis {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                {isExpanded && (
                  <div className="bg-app-surface rounded-lg p-4 mb-3">
                    {loadingAnalysis === insight.id ? <AIGenerating label="Generating analysis..." /> : analyses[insight.id] ? <p className="font-dm text-text-mid text-sm leading-relaxed">{analyses[insight.id]}</p> : null}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button onClick={() => dismissInsight(insight.id)} className="px-3 py-1.5 text-text-dim text-xs font-dm hover:text-text-primary transition-colors flex items-center gap-1"><X size={12} />Dismiss</button>
                  <button onClick={() => resolveInsight(insight.id)} className="px-3 py-1.5 text-status-green text-xs font-dm hover:opacity-80 transition-opacity flex items-center gap-1"><Check size={12} />Mark Resolved</button>
                  <button onClick={() => { setTaskModal(insight); setTaskTitle(`Address: ${insight.type}`) }} className="px-3 py-1.5 text-accent text-xs font-dm hover:opacity-80 transition-opacity flex items-center gap-1"><Plus size={12} />Create Task</button>
                </div>
              </div>
            </Card>
          )
        })}
        {filteredInsights.length === 0 && <div className="text-center py-12"><p className="font-dm text-text-dim text-sm">No insights match the current filters.</p></div>}
      </div>

      {resolvedInsights.length > 0 && (
        <div className="mt-8">
          <button onClick={() => setShowResolved(!showResolved)} className="flex items-center gap-2 text-text-dim text-sm font-dm hover:text-text-mid transition-colors">
            {showResolved ? <ChevronUp size={16} /> : <ChevronDown size={16} />}Resolved Insights ({resolvedInsights.length})
          </button>
          {showResolved && (
            <div className="mt-4 space-y-3 opacity-60">
              {resolvedInsights.map(insight => (
                <Card key={insight.id} className="p-4">
                  <div className="flex items-center gap-2"><Check size={14} className="text-status-green" /><span className="font-dm text-text-dim text-sm line-through">{insight.type}: {insight.body.slice(0, 100)}...</span></div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {taskModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setTaskModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-app-surface border border-app-border rounded-lg p-6 z-50 w-[400px]">
            <h3 className="font-syne font-bold text-text-primary text-lg mb-4">Create Task</h3>
            <div className="mb-4"><label className="font-dm text-text-dim text-xs block mb-1">Task Title</label><input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-text-primary font-dm text-sm focus:border-accent-border focus:outline-none" /></div>
            <div className="mb-4"><label className="font-dm text-text-dim text-xs block mb-1">Source Insight</label><p className="font-dm text-text-mid text-sm">{taskModal.type}</p></div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setTaskModal(null)} className="px-4 py-2 text-text-dim font-dm text-sm hover:text-text-primary transition-colors">Cancel</button>
              <button onClick={createTask} className="px-4 py-2 bg-accent text-app-bg font-dm text-sm rounded-lg hover:bg-accent/90 transition-colors">Create Task</button>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-app-card border border-app-border rounded-lg px-4 py-3 shadow-lg z-50 animate-slide-in">
          <p className="font-dm text-text-primary text-sm flex items-center gap-2"><Check size={16} className="text-status-green" />{toast}</p>
        </div>
      )}
    </div>
  )
}
