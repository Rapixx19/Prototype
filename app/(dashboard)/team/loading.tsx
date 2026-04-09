export default function TeamPageLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page Header */}
      <div className="mb-6">
        <div className="h-3 w-28 bg-app-card rounded mb-2" />
        <div className="h-8 w-40 bg-app-card rounded mb-1" />
        <div className="h-4 w-52 bg-app-card rounded" />
      </div>

      {/* Team Grid — 4 columns */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-app-card border border-app-border rounded-lg p-5"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-app-surface rounded-full" />
              <div>
                <div className="h-5 w-24 bg-app-surface rounded mb-1" />
                <div className="h-3 w-16 bg-app-surface rounded" />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-app-surface rounded" />
                <div className="h-3 w-8 bg-app-surface rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-app-surface rounded" />
                <div className="h-3 w-6 bg-app-surface rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-14 bg-app-surface rounded" />
                <div className="h-3 w-10 bg-app-surface rounded" />
              </div>
            </div>

            {/* Status indicator */}
            <div className="mt-4 pt-4 border-t border-app-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-app-surface rounded-full" />
                <div className="h-3 w-20 bg-app-surface rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed skeleton */}
      <div>
        <div className="h-5 w-28 bg-app-card rounded mb-4" />
        <div className="bg-app-card border border-app-border rounded-lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b border-app-border last:border-b-0"
            >
              <div className="w-8 h-8 bg-app-surface rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-64 bg-app-surface rounded mb-1" />
                <div className="h-3 w-24 bg-app-surface rounded" />
              </div>
              <div className="h-3 w-16 bg-app-surface rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
