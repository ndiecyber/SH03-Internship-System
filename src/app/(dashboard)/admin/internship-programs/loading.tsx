export default function ProgramsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 bg-slate-100 rounded w-32" />
          <div className="h-4 bg-slate-100 rounded w-64" />
        </div>
        <div className="h-9 bg-slate-100 rounded-lg w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="h-5 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-slate-100 rounded-full w-16" />
              <div className="h-6 bg-slate-100 rounded-full w-20" />
            </div>
            <div className="h-8 bg-slate-100 rounded-lg w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
