export default function OneDrivePageLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page Header */}
      <div className="mb-6">
        <div className="h-3 w-24 bg-app-card rounded mb-2" />
        <div className="h-8 w-48 bg-app-card rounded mb-1" />
        <div className="h-4 w-56 bg-app-card rounded" />
      </div>

      {/* Connection Status Banner skeleton */}
      <div className="bg-app-card border border-app-border rounded-lg p-5 border-l-4 border-l-app-border mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-app-surface rounded-lg" />
            <div>
              <div className="h-5 w-40 bg-app-surface rounded mb-1" />
              <div className="h-3 w-64 bg-app-surface rounded" />
            </div>
          </div>
          <div className="text-right">
            <div className="h-3 w-16 bg-app-surface rounded mb-1" />
            <div className="h-4 w-24 bg-app-surface rounded" />
          </div>
        </div>
        {/* Permission scopes */}
        <div className="mt-4 pt-4 border-t border-app-border">
          <div className="h-3 w-32 bg-app-surface rounded mb-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 w-24 bg-app-surface rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* 3-column grid skeleton */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Left: Connection Details */}
        <div className="col-span-4">
          <div className="bg-app-card border border-app-border rounded-lg p-5">
            <div className="h-5 w-32 bg-app-surface rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-app-surface rounded" />
                  <div className="h-4 w-32 bg-app-surface rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Centre: Folder Tree */}
        <div className="col-span-5">
          <div className="bg-app-card border border-app-border rounded-lg p-5">
            <div className="h-5 w-28 bg-app-surface rounded mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${(i % 3) * 16}px` }}>
                  <div className="w-4 h-4 bg-app-surface rounded" />
                  <div className="h-4 w-32 bg-app-surface rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ingestion Queue */}
        <div className="col-span-3">
          <div className="bg-app-card border border-app-border rounded-lg p-5">
            <div className="h-5 w-28 bg-app-surface rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-app-surface rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-full bg-app-surface rounded mb-1" />
                    <div className="h-2 w-full bg-app-surface rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Statistics skeleton */}
      <div className="bg-app-card border border-app-border rounded-lg p-5">
        <div className="h-5 w-32 bg-app-surface rounded mb-4" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-app-surface rounded mb-2" />
              <div className="h-8 w-16 bg-app-surface rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
