'use client'

import { useState } from 'react'
import { Search, FileText, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { PWA_BRIEF_DOCUMENTS, PWA_PROJECTS } from '@/lib/pwa/pwaData'

export function DocumentsScreen() {
  const [expandedProject, setExpandedProject] = useState<string | null>('proj-01')

  const recentDocuments = PWA_BRIEF_DOCUMENTS.slice(0, 4)

  const getDocumentsByProject = (projectId: string) => {
    return PWA_BRIEF_DOCUMENTS.filter(d => d.projectId === projectId)
  }

  const getFileIcon = (type: string) => {
    return FileText
  }

  const getFileColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'report':
        return 'text-blue-400'
      case 'financial':
        return 'text-emerald-400'
      case 'legal':
        return 'text-gold'
      default:
        return 'text-text-dim'
    }
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-syne font-bold text-text-primary text-xl mb-3">Documents</h1>

        {/* Search bar (visual only) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full bg-app-card border border-app-border rounded-xl pl-10 pr-4 py-2.5 font-dm text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 transition-colors"
            readOnly
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Recent documents */}
        <div className="mb-6">
          <h2 className="font-dm font-semibold text-text-mid text-xs uppercase tracking-wide mb-3">
            Recent
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {recentDocuments.map(doc => {
              const Icon = getFileIcon(doc.type)
              return (
                <button
                  key={doc.id}
                  className="flex-shrink-0 w-[100px] bg-app-card rounded-xl p-3 border border-app-border hover:border-accent/30 transition-colors text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-app-card2 flex items-center justify-center mx-auto mb-2">
                    <Icon className={`w-5 h-5 ${getFileColor(doc.type)}`} />
                  </div>
                  <p className="font-dm text-text-primary text-xs truncate">
                    {doc.name.split('.')[0]}
                  </p>
                  <p className="font-dm text-text-dim text-[10px] mt-0.5">
                    {doc.type}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* By Project */}
        <div>
          <h2 className="font-dm font-semibold text-text-mid text-xs uppercase tracking-wide mb-3">
            By Project
          </h2>
          <div className="space-y-2">
            {PWA_PROJECTS.map(project => {
              const isExpanded = expandedProject === project.id
              const projectDocs = getDocumentsByProject(project.id)

              return (
                <div key={project.id} className="bg-app-card rounded-xl border border-app-border overflow-hidden">
                  {/* Project header */}
                  <button
                    onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-app-card2 transition-colors text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <FolderOpen className="w-4 h-4" style={{ color: project.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-dm font-semibold text-text-primary text-sm">
                        {project.name}
                      </span>
                      <span className="font-dm text-text-dim text-xs ml-2">
                        ({project.documentCount})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-text-dim" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-text-dim" />
                    )}
                  </button>

                  {/* Documents list */}
                  {isExpanded && projectDocs.length > 0 && (
                    <div className="border-t border-app-border">
                      {projectDocs.map((doc, i) => {
                        const Icon = getFileIcon(doc.type)
                        return (
                          <button
                            key={doc.id}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-app-card2 transition-colors text-left ${
                              i < projectDocs.length - 1 ? 'border-b border-app-border/50' : ''
                            }`}
                          >
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-app-bg">
                              <Icon className={`w-3.5 h-3.5 ${getFileColor(doc.type)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-dm text-text-primary text-xs truncate">
                                {doc.name}
                              </p>
                              <p className="font-dm text-text-dim text-[10px]">
                                {doc.date} · {doc.size}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
