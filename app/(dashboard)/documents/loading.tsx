export default function DocumentsPageLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-3 w-24 bg-app-card rounded mb-2" />
          <div className="h-8 w-40 bg-app-card rounded mb-1" />
          <div className="h-4 w-36 bg-app-card rounded" />
        </div>
      </div>

      {/* Search Bar skeleton */}
      <div className="h-12 w-full bg-app-card rounded-lg mb-4" />

      {/* Filter Bar skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-16 bg-app-card rounded" />
          ))}
        </div>
        <div className="h-8 w-32 bg-app-card rounded" />
        <div className="h-8 w-24 bg-app-card rounded" />
        <div className="h-8 w-28 bg-app-card rounded" />
      </div>

      {/* Results Header skeleton */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="h-4 w-32 bg-app-card rounded" />
        <div className="h-4 w-24 bg-app-card rounded" />
      </div>

      {/* Document List skeleton */}
      <div className="bg-app-card border border-app-border rounded-lg overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-app-border last:border-b-0"
          >
            {/* Document icon */}
            <div className="w-10 h-10 bg-app-surface rounded" />

            {/* Document info */}
            <div className="flex-1 min-w-0">
              <div className="h-5 w-64 bg-app-surface rounded mb-1" />
              <div className="h-3 w-48 bg-app-surface rounded" />
            </div>

            {/* Project badge */}
            <div className="h-6 w-24 bg-app-surface rounded-full" />

            {/* Confidence bar */}
            <div className="w-20">
              <div className="h-2 w-full bg-app-surface rounded-full" />
            </div>

            {/* Date */}
            <div className="h-4 w-16 bg-app-surface rounded" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="h-10 w-24 bg-app-card rounded" />
        <div className="h-4 w-24 bg-app-card rounded" />
        <div className="h-10 w-24 bg-app-card rounded" />
      </div>
    </div>
  )
}
