export default function InternLogbookLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-24" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      {/* Form skeleton */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
        <div className="h-5 bg-slate-100 rounded w-32" />
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-20" />
          <div className="h-10 bg-slate-100 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-24" />
          <div className="h-20 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-9 bg-slate-100 rounded-lg w-32" />
      </div>
      {/* History skeleton */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="h-5 bg-slate-100 rounded w-36" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-100 rounded w-36" />
              <div className="h-3 bg-slate-100 rounded w-64" />
            </div>
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
