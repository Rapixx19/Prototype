export default function DashboardPageLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-3 w-24 bg-app-card rounded mb-2" />
          <div className="h-8 w-64 bg-app-card rounded mb-1" />
          <div className="h-4 w-48 bg-app-card rounded" />
        </div>
        <div className="h-4 w-56 bg-app-card rounded" />
      </div>

      {/* Morning Briefing Card skeleton */}
      <div className="bg-app-card border border-app-border rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 bg-app-surface rounded" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-48 bg-app-surface rounded" />
            <div className="h-4 w-full bg-app-surface rounded" />
            <div className="h-4 w-3/4 bg-app-surface rounded" />
            <div className="h-4 w-5/6 bg-app-surface rounded" />
          </div>
        </div>
      </div>

      {/* 3-column Grid skeleton */}
      <div className="grid grid-cols-12 gap-6">
        {/* Col 1 — Meetings */}
        <div className="col-span-5">
          <div className="h-5 w-32 bg-app-card rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-app-card rounded-lg" />
            ))}
          </div>
        </div>

        {/* Col 2 — Tasks + Alerts */}
        <div className="col-span-4 space-y-6">
          <div>
            <div className="h-5 w-24 bg-app-card rounded mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-app-card rounded-lg" />
              ))}
            </div>
          </div>
          <div>
            <div className="h-5 w-32 bg-app-card rounded mb-4" />
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-app-card rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Col 3 — Insights */}
        <div className="col-span-3">
          <div className="h-5 w-28 bg-app-card rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-app-card rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Team Strip skeleton */}
      <div className="mt-6">
        <div className="h-5 w-24 bg-app-card rounded mb-4" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-48 h-24 bg-app-card rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
