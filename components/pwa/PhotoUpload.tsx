'use client'

import { useState } from 'react'
import { ArrowLeft, Camera, Scan, Check, Loader2, PenLine } from 'lucide-react'

export interface PhotoUploadProps {
  onBack: () => void
}

type UploadState = 'viewfinder' | 'captured' | 'processing' | 'extracted'

interface ExtractedData {
  title: string
  items: { label: string; value: string }[]
}

const MOCK_EXTRACTED_DATA: ExtractedData = {
  title: 'Document Extracted',
  items: [
    { label: 'Document Type', value: 'Invoice' },
    { label: 'Vendor', value: 'Hartley Capital Partners' },
    { label: 'Amount', value: '£12,500.00' },
    { label: 'Date', value: '10 April 2025' },
    { label: 'Reference', value: 'INV-2025-0847' },
  ],
}

export function PhotoUpload({ onBack }: PhotoUploadProps) {
  const [state, setState] = useState<UploadState>('viewfinder')
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)

  const handleCapture = () => {
    setState('captured')
    // Simulate processing delay
    setTimeout(() => {
      setState('processing')
      setTimeout(() => {
        setExtractedData(MOCK_EXTRACTED_DATA)
        setState('extracted')
      }, 2000)
    }, 500)
  }

  const handleRetake = () => {
    setState('viewfinder')
    setExtractedData(null)
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-app-border z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-app-card flex items-center justify-center hover:bg-app-card2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-text-mid" />
        </button>
        <span className="font-dm font-semibold text-text-primary text-sm">
          {state === 'extracted' ? 'Document Captured' : 'Capture Document'}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Viewfinder / Captured state */}
        {(state === 'viewfinder' || state === 'captured' || state === 'processing') && (
          <div className="flex-1 relative bg-gray-900">
            {/* Simulated camera view */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[85%] aspect-[4/3] bg-app-card2 rounded-lg overflow-hidden">
                {/* Handwritten notes document */}
                <div className="absolute inset-3 bg-[#FFFDE7] rounded shadow-lg overflow-hidden">
                  {/* Red margin line */}
                  <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-rose-300/60" />

                  {/* Blue ruled lines */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={`${15 + i * 12}%`}
                        x2="100%"
                        y2={`${15 + i * 12}%`}
                        stroke="#B8D4E8"
                        strokeWidth="0.5"
                        opacity="0.6"
                      />
                    ))}
                  </svg>

                  {/* Handwritten content */}
                  <div className="relative p-2 pl-8 pt-3 space-y-1">
                    <p className="font-[var(--font-caveat)] text-gray-800 text-[11px] leading-tight rotate-[-0.5deg]">
                      Q2 Portfolio Review Notes
                    </p>
                    <p className="font-[var(--font-caveat)] text-gray-700 text-[9px] leading-tight rotate-[0.3deg] pl-1">
                      - Harbour Gate IRR: 18%
                    </p>
                    <p className="font-[var(--font-caveat)] text-gray-700 text-[9px] leading-tight rotate-[-0.2deg]">
                      - Planning consent: 8 wks
                    </p>
                    <p className="font-[var(--font-caveat)] text-gray-700 text-[9px] leading-tight rotate-[0.5deg] pl-0.5">
                      - Equity structure pending
                    </p>
                    <p className="font-[var(--font-caveat)] text-gray-600 text-[8px] leading-tight rotate-[-0.3deg] pt-1">
                      Follow up w/ James re: docs
                    </p>
                  </div>

                  {/* Pen icon */}
                  <div className="absolute bottom-1.5 right-1.5">
                    <PenLine className="w-3 h-3 text-gray-400/60" />
                  </div>
                </div>

                {/* Corner guides */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent rounded-tl" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent rounded-tr" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br" />

                {/* Scan line animation (processing state) */}
                {state === 'processing' && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-b from-accent/0 via-accent to-accent/0 animate-scan-line" />
                  </div>
                )}

                {/* Processing overlay */}
                {state === 'processing' && (
                  <div className="absolute inset-0 bg-app-bg/60 flex flex-col items-center justify-center">
                    <Scan className="w-8 h-8 text-accent animate-pulse" />
                    <p className="font-dm text-accent text-sm mt-2">Extracting data...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Flash indicator when captured */}
            {state === 'captured' && (
              <div className="absolute inset-0 bg-white/20 animate-flash" />
            )}
          </div>
        )}

        {/* Extracted data state */}
        {state === 'extracted' && extractedData && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-app-card rounded-xl border border-app-border p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="font-dm font-semibold text-text-primary text-sm">
                  {extractedData.title}
                </span>
              </div>

              <div className="space-y-3">
                {extractedData.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <span className="font-dm text-text-dim text-xs">{item.label}</span>
                    <span className="font-dm text-text-primary text-sm font-medium text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-dm text-text-dim text-xs text-center">
              Data extracted using VecterAI OCR
            </p>
          </div>
        )}

        {/* Bottom controls */}
        <div className="p-4 border-t border-app-border">
          {state === 'viewfinder' && (
            <button
              onClick={handleCapture}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent rounded-xl hover:bg-accent/90 transition-colors"
            >
              <Camera className="w-5 h-5 text-text-primary" />
              <span className="font-dm font-semibold text-text-primary">Capture</span>
            </button>
          )}

          {state === 'processing' && (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 py-3 bg-app-card rounded-xl cursor-not-allowed"
            >
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <span className="font-dm font-semibold text-text-mid">Processing...</span>
            </button>
          )}

          {state === 'extracted' && (
            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 bg-app-card border border-app-border rounded-xl hover:bg-app-card2 transition-colors"
              >
                <span className="font-dm font-semibold text-text-mid">Retake</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-accent rounded-xl hover:bg-accent/90 transition-colors"
              >
                <span className="font-dm font-semibold text-text-primary">Save</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
