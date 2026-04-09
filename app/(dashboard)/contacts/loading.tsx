export default function ContactsLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-3 w-28 bg-app-card rounded mb-2" />
        <div className="h-8 w-48 bg-app-card rounded mb-1" />
        <div className="h-4 w-56 bg-app-card rounded" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-20 bg-app-card rounded-lg" />
          ))}
        </div>
        <div className="h-10 w-64 bg-app-card rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} className="bg-app-card border border-app-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-app-surface rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-app-surface rounded mb-1" />
                <div className="h-3 w-20 bg-app-surface rounded mb-1" />
                <div className="h-3 w-28 bg-app-surface rounded" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="h-5 w-16 bg-app-surface rounded" />
              <div className="h-3 w-20 bg-app-surface rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
