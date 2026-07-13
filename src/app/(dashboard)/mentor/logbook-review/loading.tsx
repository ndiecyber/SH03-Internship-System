function SkeletonLogRow() {
  return (
    <div className="p-5 border-b border-slate-50 last:border-0 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-slate-100 rounded w-32" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </div>
        </div>
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-4/5" />
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-slate-100 rounded-lg" />
        <div className="h-8 w-24 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

export default function LogbookReviewLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-36" />
        <div className="h-4 bg-slate-100 rounded w-72" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {[...Array(4)].map((_, i) => <SkeletonLogRow key={i} />)}
      </div>
    </div>
  );
}
