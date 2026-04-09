'use client'

interface RouteMapProps {
  destination: string
}

export function RouteMap({ destination }: RouteMapProps) {
  return (
    <div className="bg-app-card rounded-xl p-4 h-[160px] relative overflow-hidden">
      <svg
        viewBox="0 0 340 120"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="mapGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapGrid)" />

        {/* Abstract streets/water */}
        <path
          d="M 0 90 Q 80 85 170 75 T 340 60"
          fill="none"
          stroke="rgba(0, 200, 240, 0.15)"
          strokeWidth="30"
        />
        <path
          d="M 0 40 Q 100 50 170 45 T 340 30"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />

        {/* Route line (dashed) */}
        <path
          d="M 50 85 Q 120 70 170 60 Q 220 50 290 35"
          fill="none"
          stroke="#00C8F0"
          strokeWidth="3"
          strokeDasharray="8 4"
          className="animate-pulse"
        />

        {/* Origin marker */}
        <g transform="translate(50, 85)">
          <circle r="12" fill="#00C8F0" fillOpacity="0.3" />
          <circle r="6" fill="#00C8F0" />
          <circle r="3" fill="#0A0E14" />
        </g>

        {/* Destination marker */}
        <g transform="translate(290, 35)">
          <circle r="12" fill="#00C8F0" fillOpacity="0.3" />
          <circle r="8" fill="#00C8F0" />
          <path
            d="M 0 -4 L 0 4 M -4 0 L 4 0"
            stroke="#0A0E14"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Location labels */}
      <div className="absolute bottom-3 left-3">
        <span className="px-2 py-1 bg-app-bg/80 backdrop-blur-sm rounded text-[10px] font-dm text-text-mid">
          Canary Wharf
        </span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 bg-accent/20 backdrop-blur-sm rounded text-[10px] font-dm text-accent">
          {destination}
        </span>
      </div>
    </div>
  )
}
