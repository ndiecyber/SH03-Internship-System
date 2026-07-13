export default function MentorProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-200 rounded-2xl p-6 md:p-8 h-36" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-100" />
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-100 rounded w-28" />
              <div className="h-3 bg-slate-100 rounded w-48" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-20" />
            <div className="h-10 bg-slate-100 rounded-lg max-w-md" />
          </div>
          <div className="h-9 bg-slate-100 rounded-lg w-36" />
        </div>
      ))}
    </div>
  );
}
