'use client'

import { ReactNode } from 'react'
import { Signal, Wifi, Battery } from 'lucide-react'

export interface PhoneFrameProps {
  children: ReactNode
}

function StatusBar() {
  return (
    <div className="h-12 px-6 flex items-center justify-between relative z-10">
      {/* Left - Time */}
      <span className="font-dm font-semibold text-white text-[13px] w-12">
        08:30
      </span>

      {/* Center - Dynamic Island */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[120px] h-[32px] bg-black rounded-full flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[#1C1C1E] border border-[#2C2C2E]" />
      </div>

      {/* Right - Status Icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4 text-white" />
        <Wifi className="w-4 h-4 text-white" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-5 h-5 text-white" />
          <span className="font-dm text-[11px] text-white">85%</span>
        </div>
      </div>
    </div>
  )
}

function HomeIndicator() {
  return (
    <div className="h-8 flex items-center justify-center">
      <div className="w-[134px] h-[5px] bg-white/60 rounded-full" />
    </div>
  )
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative">
      {/* Outer Frame - iPhone Space Gray */}
      <div
        className="w-[406px] h-[860px] bg-[#1C1C1E] rounded-[52px] p-2 shadow-2xl"
        style={{
          boxShadow: '0 0 60px rgba(0, 200, 240, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Inner Screen */}
        <div className="w-[390px] h-[844px] bg-app-bg rounded-[44px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <StatusBar />

          {/* Screen Content */}
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>

          {/* Home Indicator */}
          <HomeIndicator />
        </div>
      </div>
    </div>
  )
}
