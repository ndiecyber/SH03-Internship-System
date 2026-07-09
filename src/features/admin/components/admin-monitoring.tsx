"use client";

import { useState } from "react";
import { Search } from "lucide-react";

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
    internRelation: {
      mentor: { id: string; name: string | null; email: string };
    } | null;
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

const statusLabels: Record<string, string> = {
  all: "Semua",
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak"
};

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function AdminMonitoring({ logbooks }: Readonly<AdminMonitoringProps>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIntern, setFilterIntern] = useState("all");
  const [filterMentor, setFilterMentor] = useState("all");

  const pendingCount = logbooks.filter((log) => log.status === "pending").length;
  const approvedCount = logbooks.filter((log) => log.status === "approved").length;
  const rejectedCount = logbooks.filter((log) => log.status === "rejected").length;

  // Unique intern names for filter dropdown
  const uniqueInterns = Array.from(
    new Map(
      logbooks.map((log) => [log.user.email, log.user.name ?? log.user.email])
    ).entries()
  );

  // Unique mentors for filter dropdown
  const uniqueMentors = Array.from(
    new Map(
      logbooks
        .filter((log) => log.user.internRelation?.mentor)
        .map((log) => {
          const m = log.user.internRelation!.mentor;
          return [m.id, m.name ?? m.email] as [string, string];
        })
    ).entries()
  );

  const filtered = logbooks.filter((log) => {
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesIntern = filterIntern === "all" || log.user.email === filterIntern;
    const matchesMentor =
      filterMentor === "all" ||
      log.user.internRelation?.mentor.id === filterMentor ||
      (filterMentor === "unassigned" && !log.user.internRelation?.mentor);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      log.user.name?.toLowerCase().includes(q) ||
      log.user.email.toLowerCase().includes(q) ||
      log.activity.toLowerCase().includes(q);
    return matchesStatus && matchesIntern && matchesMentor && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Filters */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Intern dropdown */}
          <select
            value={filterIntern}
            onChange={(e) => setFilterIntern(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >
            <option value="all">Semua Intern</option>
            {uniqueInterns.map(([email, name]) => (
              <option key={email} value={email}>
                {name}
              </option>
            ))}
          </select>

          {/* Mentor dropdown */}
          <select
            value={filterMentor}
            onChange={(e) => setFilterMentor(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >
            <option value="all">Semua Mentor</option>
            <option value="unassigned">Belum ada mentor</option>
            {uniqueMentors.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Logbook Magang</h2>
            <p className="text-sm text-slate-500">
              Pantau aktivitas harian dari akun role magang yang sudah mengirim logbook.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari{" "}
            <span className="font-semibold text-slate-700">{logbooks.length}</span> logbook
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada logbook yang sesuai dengan filter yang dipilih.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="px-3 py-3 font-medium">Intern</th>
                  <th className="px-3 py-3 font-medium">Mentor</th>
                  <th className="px-3 py-3 font-medium">Tanggal</th>
                  <th className="px-3 py-3 font-medium">Progress</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Aktivitas</th>
                  <th className="px-3 py-3 font-medium">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((logbook) => (
                  <tr key={logbook.id} className="align-top">
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-900">{logbook.user.name ?? "Tanpa nama"}</div>
                      <div className="text-xs text-slate-500">{logbook.user.email}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {logbook.user.internRelation?.mentor ? (
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {logbook.user.internRelation.mentor.name ?? "—"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {logbook.user.internRelation.mentor.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum ditugaskan</span>
                      )}
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
                      {logbook.feedback ? (
                        <div className="line-clamp-3">{logbook.feedback}</div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
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
