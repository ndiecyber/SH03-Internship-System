function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
      <div className="h-9 w-9 rounded-full bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-36" />
        <div className="h-3 bg-slate-100 rounded w-48" />
      </div>
      <div className="h-6 w-16 bg-slate-100 rounded-full" />
      <div className="h-8 w-20 bg-slate-100 rounded-lg" />
    </div>
  );
}

export default function MentorsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-28" />
        <div className="h-4 bg-slate-100 rounded w-72" />
      </div>
      <div className="rounded-lg border border-slate-200 p-6">
        <div className="h-5 bg-slate-100 rounded w-32 mb-4" />
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    </div>
  );
}
