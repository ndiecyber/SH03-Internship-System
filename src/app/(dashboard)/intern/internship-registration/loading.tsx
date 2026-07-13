export default function InternRegistrationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-48" />
        <div className="h-4 bg-slate-100 rounded w-72" />
      </div>
      {/* Available programs skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="h-5 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
            <div className="h-9 bg-slate-100 rounded-lg w-full mt-2" />
          </div>
        ))}
      </div>
      {/* Application history skeleton */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-3">
        <div className="h-5 bg-slate-100 rounded w-36" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
            <div className="space-y-1.5">
              <div className="h-3.5 bg-slate-100 rounded w-40" />
              <div className="h-3 bg-slate-100 rounded w-28" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
