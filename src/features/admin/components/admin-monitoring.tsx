type MonitoringLogbook = {
  id: string;
  activity: string;
  progress: number;
  status: string;
  feedback: string | null;
  date: Date;
  user: {
    name: string | null;
    email: string;
  };
};

type AdminMonitoringProps = {
  logbooks: MonitoringLogbook[];
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700"
};

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function AdminMonitoring({ logbooks }: Readonly<AdminMonitoringProps>) {
  const pendingCount = logbooks.filter((log) => log.status === "pending").length;
  const approvedCount = logbooks.filter((log) => log.status === "approved").length;
  const rejectedCount = logbooks.filter((log) => log.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Logbook</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{logbooks.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Menunggu Review</p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Status Final</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{approvedCount + rejectedCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Logbook Magang</h2>
            <p className="text-sm text-slate-500">
              Pantau aktivitas harian dari akun role magang yang sudah mengirim logbook.
            </p>
          </div>
        </div>

        {logbooks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada logbook dari akun magang yang tersedia.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="px-3 py-3 font-medium">Intern</th>
                  <th className="px-3 py-3 font-medium">Tanggal</th>
                  <th className="px-3 py-3 font-medium">Progress</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Aktivitas</th>
                  <th className="px-3 py-3 font-medium">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logbooks.map((logbook) => (
                  <tr key={logbook.id} className="align-top">
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-900">{logbook.user.name ?? "Tanpa nama"}</div>
                      <div className="text-xs text-slate-500">{logbook.user.email}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-600">{formatDate(logbook.date)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-600">{logbook.progress}%</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[logbook.status] ?? "bg-slate-100 text-slate-700"}`}
                      >
                        {logbook.status}
                      </span>
                    </td>
                    <td className="max-w-[280px] px-3 py-3 text-slate-600">
                      <div className="line-clamp-3">{logbook.activity}</div>
                    </td>
                    <td className="max-w-[220px] px-3 py-3 text-slate-600">
                      {logbook.feedback ? <div className="line-clamp-3">{logbook.feedback}</div> : <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
