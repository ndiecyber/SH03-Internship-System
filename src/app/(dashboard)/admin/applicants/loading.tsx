// Shared skeleton component
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
      <div className="h-9 w-9 rounded-full bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-40" />
        <div className="h-3 bg-slate-100 rounded w-56" />
      </div>
      <div className="h-6 w-20 bg-slate-100 rounded-full" />
      <div className="h-8 w-24 bg-slate-100 rounded-lg" />
    </div>
  );
}

export default function ApplicantsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-32" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-3">
        <div className="h-9 bg-slate-100 rounded-lg w-40" />
        <div className="h-9 bg-slate-100 rounded-lg w-28" />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="h-4 bg-slate-100 rounded w-24" />
        </div>
        {[...Array(6)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}
