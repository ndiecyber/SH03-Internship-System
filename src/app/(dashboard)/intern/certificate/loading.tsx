export default function CertificateLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-slate-100 rounded w-36" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-slate-100" />
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="h-4 bg-slate-100 rounded w-64" />
        <div className="h-10 bg-slate-100 rounded-lg w-40" />
      </div>
    </div>
  );
}
