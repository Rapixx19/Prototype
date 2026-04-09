export default function DashboardRootLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-3 w-24 bg-app-card rounded mb-2" />
      <div className="h-8 w-48 bg-app-card rounded mb-1" />
      <div className="h-4 w-32 bg-app-card rounded mb-8" />

      {/* Content area skeleton */}
      <div className="space-y-6">
        {/* Main content block */}
        <div className="h-40 bg-app-card rounded-lg" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 h-64 bg-app-card rounded-lg" />
          <div className="col-span-4 h-64 bg-app-card rounded-lg" />
          <div className="col-span-3 h-64 bg-app-card rounded-lg" />
        </div>
      </div>
    </div>
  )
}
