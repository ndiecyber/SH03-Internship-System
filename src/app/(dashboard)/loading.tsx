/**
 * Generic page loading skeleton untuk semua halaman dashboard.
 * Ditampilkan otomatis oleh Next.js saat navigasi antara halaman.
 */
export default function PageLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-48" />
      <div className="h-4 bg-slate-100 rounded w-64" />
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 h-48" />
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 h-64" />
    </div>
  );
}
