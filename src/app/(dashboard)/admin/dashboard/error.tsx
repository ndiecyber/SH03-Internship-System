"use client";

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-sm text-slate-500">Terjadi kesalahan saat memuat dashboard.</p>
      <button
        onClick={reset}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
      >
        Coba lagi
      </button>
    </div>
  );
}
