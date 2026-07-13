export default function MentorDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="rounded-2xl p-6 md:p-8 bg-slate-200 h-28" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-3 bg-slate-100 rounded w-24 mb-3" />
            <div className="h-7 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 h-56" />
    </div>
  );
}
