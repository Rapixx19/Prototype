export default function CalendarLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-3 w-32 bg-app-card rounded mb-2" />
        <div className="h-8 w-32 bg-app-card rounded mb-1" />
        <div className="h-4 w-40 bg-app-card rounded" />
      </div>

      <div className="grid grid-cols-7 gap-3 mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="bg-app-card border border-app-border rounded-lg p-3 min-h-[200px]">
            <div className="text-center mb-3">
              <div className="h-3 w-8 bg-app-surface rounded mx-auto mb-1" />
              <div className="h-6 w-6 bg-app-surface rounded mx-auto" />
            </div>
            <div className="space-y-2">
              {i <= 4 && (
                <>
                  <div className="h-12 bg-app-surface rounded" />
                  {i <= 2 && <div className="h-12 bg-app-surface rounded" />}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="h-3 w-32 bg-app-card rounded mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-app-card border border-app-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 w-48 bg-app-surface rounded mb-2" />
                <div className="h-3 w-32 bg-app-surface rounded mb-1" />
                <div className="h-3 w-24 bg-app-surface rounded" />
              </div>
              <div className="h-5 w-16 bg-app-surface rounded" />
            </div>
            <div className="mt-3 h-5 w-24 bg-app-surface rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
