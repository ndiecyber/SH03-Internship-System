export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="rounded-2xl p-6 md:p-8 bg-slate-200 h-28" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl p-3 bg-slate-100 h-12 w-12 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-100 rounded w-24" />
              <div className="h-5 bg-slate-100 rounded w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 h-64" />
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 h-36" />
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 h-44" />
        </div>
      </div>
    </div>
  );
}
