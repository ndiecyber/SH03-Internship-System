export default function InternProgressLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-28" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      {/* Progress bar */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="h-5 bg-slate-100 rounded w-36" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-12" />
          <div className="h-3 bg-slate-100 rounded w-12" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
            <div className="h-3 bg-slate-100 rounded w-24 mb-2" />
            <div className="h-7 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
