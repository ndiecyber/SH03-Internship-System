function SkeletonLogRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-32" />
        <div className="h-3 bg-slate-100 rounded w-64" />
      </div>
      <div className="h-6 w-20 bg-slate-100 rounded-full" />
      <div className="h-6 w-16 bg-slate-100 rounded-full" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

export default function MonitoringLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-36" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="h-3 bg-slate-100 rounded w-20 mb-2" />
            <div className="h-6 bg-slate-100 rounded w-10" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {[...Array(6)].map((_, i) => <SkeletonLogRow key={i} />)}
      </div>
    </div>
  );
}
