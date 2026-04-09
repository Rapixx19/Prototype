export default function InsightsLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-3 w-32 bg-app-card rounded mb-2" />
        <div className="h-8 w-40 bg-app-card rounded mb-1" />
        <div className="h-4 w-48 bg-app-card rounded" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-app-card border border-app-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-app-surface rounded" />
              <div>
                <div className="h-3 w-16 bg-app-surface rounded mb-1" />
                <div className="h-6 w-8 bg-app-surface rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-20 bg-app-card rounded-lg" />
          ))}
        </div>
        <div className="h-10 w-40 bg-app-card rounded-lg" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-app-card border border-app-border rounded-lg p-5 border-l-4 border-l-app-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-16 bg-app-surface rounded" />
                  <div className="h-3 w-24 bg-app-surface rounded" />
                </div>
                <div className="h-4 w-full bg-app-surface rounded mb-2" />
                <div className="h-4 w-3/4 bg-app-surface rounded" />
                <div className="flex gap-2 mt-3">
                  <div className="h-6 w-24 bg-app-surface rounded" />
                  <div className="h-6 w-20 bg-app-surface rounded" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-app-border">
              <div className="h-4 w-32 bg-app-surface rounded mb-3" />
              <div className="flex items-center gap-3">
                <div className="h-6 w-16 bg-app-surface rounded" />
                <div className="h-6 w-24 bg-app-surface rounded" />
                <div className="h-6 w-20 bg-app-surface rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
