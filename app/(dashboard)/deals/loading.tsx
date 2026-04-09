export default function DealsPageLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-3 w-16 bg-app-card rounded mb-2" />
          <div className="h-8 w-48 bg-app-card rounded mb-1" />
          <div className="h-4 w-40 bg-app-card rounded" />
        </div>
      </div>

      {/* Filter Bar skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-20 bg-app-card rounded-lg" />
          ))}
        </div>
        <div className="h-10 w-64 bg-app-card rounded-lg" />
      </div>

      {/* Project Grid skeleton */}
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-app-card border border-app-border rounded-lg p-5"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-app-surface rounded-lg" />
                <div>
                  <div className="h-5 w-32 bg-app-surface rounded mb-1" />
                  <div className="h-3 w-20 bg-app-surface rounded" />
                </div>
              </div>
              <div className="h-6 w-16 bg-app-surface rounded-full" />
            </div>

            {/* Card content */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-app-surface rounded" />
              <div className="h-4 w-3/4 bg-app-surface rounded" />
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-app-border">
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-app-surface rounded-full" />
                <div className="w-6 h-6 bg-app-surface rounded-full" />
                <div className="w-6 h-6 bg-app-surface rounded-full" />
              </div>
              <div className="h-4 w-24 bg-app-surface rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
