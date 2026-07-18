"use client";

import { useState, useMemo } from "react";
import {
  Users, Check, X, Search, Link as LinkIcon,
  Eye, ChevronLeft, ChevronRight, Download,
  ClipboardList, Clock, CheckCircle, XCircle,
  ChevronDown, MessageSquare, SortAsc
} from "lucide-react";
import { reviewApplicationAction } from "../services/applicant.actions";
import { Button } from "@/components/ui/button";

type User = { id: string; name: string | null; email: string };
type Program = { id: string; title: string; batch?: string | null };

type Application = {
  id: string;
  userId: string;
  programId: string;
  status: string;
  cvUrl: string | null;
  notes: string | null;
  createdAt: Date;
  user: User;
  program: Program;
};

type ApplicantManagerProps = {
  initialApplications: Application[];
};

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500",
  "bg-rose-500", "bg-indigo-500", "bg-amber-500",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string | null) {
  if (!name) return "??";
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const PAGE_SIZE = 8;

export function ApplicantManager({ initialApplications }: Readonly<ApplicantManagerProps>) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Detail / reject modal state
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counts for stat cards & filter tabs
  const counts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    review: applications.filter(a => a.status === "review").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  }), [applications]);

  const filteredApps = useMemo(() => {
    let list = applications.filter(app => {
      const matchStatus = filterStatus === "all" || app.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (app.user.name?.toLowerCase().includes(q) ?? false) ||
        app.user.email.toLowerCase().includes(q) ||
        app.program.title.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
    list = [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
    return list;
  }, [applications, filterStatus, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE));
  const paginated = filteredApps.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  // Reset to page 1 when filter/search changes
  const setFilter = (s: string) => { setFilterStatus(s); setCurrentPage(1); };
  const setSearch = (s: string) => { setSearchQuery(s); setCurrentPage(1); };

  const handleReview = async (id: string, status: "approved" | "rejected", notes?: string) => {
    setIsSubmitting(true);
    try {
      const res = await reviewApplicationAction(id, status, notes);
      if (res.error) {
        alert(res.error);
      } else {
        setApplications(prev =>
          prev.map(app => app.id === id ? { ...app, status, notes: notes ?? app.notes } : app)
        );
        setRejectingId(null);
        setRejectNotes("");
      }
    } catch {
      alert("Gagal memproses pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    const rows = [
      ["Nama", "Email", "Program", "Batch", "Tanggal Daftar", "Status"],
      ...filteredApps.map(a => [
        a.user.name ?? "-",
        a.user.email,
        a.program.title,
        a.program.batch ?? "-",
        new Date(a.createdAt).toLocaleDateString("id-ID"),
        a.status,
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "applications.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Stat card helper
  const StatCard = ({
    icon, label, value, sub, iconBg
  }: { icon: React.ReactNode; label: string; value: number; sub: string; iconBg: string }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4 flex-1 min-w-0">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );

  const filterTabs = [
    { id: "all",      label: "All",      count: counts.all },
    { id: "pending",  label: "Pending",  count: counts.pending },
    { id: "review",   label: "Review",   count: counts.review },
    { id: "approved", label: "Accepted", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-bold text-slate-800">Applications</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review and process incoming internship applications</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          label="Total Applications"
          value={counts.all}
          sub="All registered applicants"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          iconBg="bg-amber-50"
          label="Pending Review"
          value={counts.pending}
          sub="Waiting for review"
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
          iconBg="bg-emerald-50"
          label="Accepted"
          value={counts.approved}
          sub={counts.all > 0 ? `${Math.round((counts.approved / counts.all) * 100)}% acceptance rate` : "acceptance rate"}
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-red-400" />}
          iconBg="bg-red-50"
          label="Rejected"
          value={counts.rejected}
          sub="of total applicants"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Applications</h2>
              <p className="text-xs text-slate-400">Review and process the incoming internship applications</p>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs gap-1.5 self-start sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>

          {/* Filter Tabs + Sort + Search */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filterStatus === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filterStatus === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}

              {/* Sort & Search — pushed right */}
              <div className="flex items-center gap-2 ml-auto">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari nama / program..."
                    value={searchQuery}
                    onChange={e => setSearch(e.target.value)}
                    className="rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-48"
                  />
                </div>
                <button
                  onClick={() => setSortOrder(s => s === "newest" ? "oldest" : "newest")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition font-medium"
                >
                  <SortAsc className="h-3.5 w-3.5" />
                  Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Mobile search */}
            <div className="relative sm:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama / program..."
                value={searchQuery}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Tidak ada pendaftar ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 w-[28%]">Applicant</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[22%]">Program</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[10%]">Batch</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[14%]">Applied Date</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[12%]">Status</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[14%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(app => {
                  const name = app.user.name ?? "Tanpa Nama";
                  const initials = getInitials(app.user.name);
                  const avatarColor = getAvatarColor(name);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition group">
                      {/* Applicant */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold ${avatarColor}`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{name}</p>
                            <p className="text-xs text-slate-400 truncate">{app.user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Program */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-slate-700 font-medium leading-snug">{app.program.title}</p>
                      </td>

                      {/* Batch */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-500 font-medium">
                          {app.program.batch ?? "—"}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-slate-600">
                          {new Date(app.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </p>
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          app.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : app.status === "review"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        }`}>
                          {app.status === "approved" ? "Accepted"
                            : app.status === "rejected" ? "Rejected"
                            : app.status === "review" ? "Review"
                            : "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {/* Eye — detail */}
                          <button
                            onClick={() => setDetailApp(app)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Check — approve (only if not approved) */}
                          {app.status !== "approved" && (
                            <button
                              disabled={isSubmitting}
                              onClick={() => handleReview(app.id, "approved")}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition disabled:opacity-40"
                              title="Terima"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* X — reject (only if not rejected) */}
                          {app.status !== "rejected" && (
                            <button
                              disabled={isSubmitting}
                              onClick={() => { setRejectingId(app.id); setRejectNotes(""); }}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                              title="Tolak"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filteredApps.length)} of {filteredApps.length} applications
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (currentPage <= 3) {
                  p = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = currentPage - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition ${
                      p === currentPage
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-slate-400 text-xs px-1">…</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Detail Pendaftar</h3>
              <button onClick={() => setDetailApp(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${getAvatarColor(detailApp.user.name ?? "?")}`}>
                  {getInitials(detailApp.user.name)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{detailApp.user.name ?? "Tanpa Nama"}</p>
                  <p className="text-xs text-slate-500">{detailApp.user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Program</p>
                  <p className="font-semibold text-slate-700">{detailApp.program.title}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Batch</p>
                  <p className="font-semibold text-slate-700">{detailApp.program.batch ?? "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Tanggal Daftar</p>
                  <p className="font-semibold text-slate-700">
                    {new Date(detailApp.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    detailApp.status === "approved" ? "bg-emerald-100 text-emerald-700"
                    : detailApp.status === "rejected" ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
                  }`}>
                    {detailApp.status === "approved" ? "Diterima" : detailApp.status === "rejected" ? "Ditolak" : "Pending"}
                  </span>
                </div>
              </div>
              {detailApp.notes && (
                <div className="bg-slate-50 rounded-xl p-3 flex gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Pesan / Motivasi</p>
                    <p className="text-sm text-slate-700">{detailApp.notes}</p>
                  </div>
                </div>
              )}
              {detailApp.cvUrl && (
                <a href={detailApp.cvUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-semibold">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Buka Tautan CV / Lampiran
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Tolak Pendaftar</h3>
              <button onClick={() => setRejectingId(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">Tambahkan alasan penolakan (opsional). Alasan ini akan dikirim ke pendaftar.</p>
              <textarea
                rows={3}
                placeholder="Alasan penolakan..."
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRejectingId(null)} className="text-slate-600 border-slate-200">
                  Batal
                </Button>
                <Button
                  disabled={isSubmitting}
                  onClick={() => handleReview(rejectingId, "rejected", rejectNotes)}
                  className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
                >
                  {isSubmitting ? "Memproses..." : "Tolak Pendaftar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
