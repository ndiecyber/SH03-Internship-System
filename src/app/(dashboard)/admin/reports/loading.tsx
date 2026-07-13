export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-28" />
        <div className="h-4 bg-slate-100 rounded w-72" />
      </div>
      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-slate-100 pb-2">
        <div className="h-8 bg-slate-100 rounded-lg w-32" />
        <div className="h-8 bg-slate-100 rounded-lg w-32" />
      </div>
      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-100 rounded w-36" />
              <div className="h-3 bg-slate-100 rounded w-52" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-8 w-20 bg-slate-100 rounded-lg" />
            <div className="h-8 w-20 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
