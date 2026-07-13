function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-100" />
        <div className="space-y-1.5">
          <div className="h-3.5 bg-slate-100 rounded w-28" />
          <div className="h-3 bg-slate-100 rounded w-36" />
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-3/4" />
      <div className="h-8 bg-slate-100 rounded-lg w-full" />
    </div>
  );
}

export default function EvaluationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-28" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
