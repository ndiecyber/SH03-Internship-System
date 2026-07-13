export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-28" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="h-5 bg-slate-100 rounded w-36" />
          <div className="h-10 bg-slate-100 rounded-lg max-w-md" />
          <div className="h-9 bg-slate-100 rounded-lg w-28" />
        </div>
      ))}
    </div>
  );
}
