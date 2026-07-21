"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart2, ClipboardList, CheckCircle2, Download,
  ChevronLeft, ChevronRight, Eye, RotateCcw,
  Check, X, Loader2, Search, MoreHorizontal,
} from "lucide-react";
import {
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  getRegistrationHistory,
} from "../services/registration-approval.actions";
import { Button } from "@/components/ui/button";

/* ─── Types ────────────────────────────────────────── */
interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

interface HistoryUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  approvalStatus: string;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  approvalReason: string | null;
  createdAt: Date;
}

interface AdminReportsProps {
  initialPending: PendingUser[];
  initialHistory: HistoryUser[];
}

/* ─── Helpers ───────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500",
  "bg-rose-500", "bg-indigo-500", "bg-amber-500",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string | null) {
  if (!name) return "??";
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const PAGE_SIZE = 5;

/* ─── Component ─────────────────────────────────────── */
export function AdminReports({ initialPending, initialHistory }: Readonly<AdminReportsProps>) {
  const [pending, setPending]   = useState<PendingUser[]>(initialPending);
  const [history, setHistory]   = useState<HistoryUser[]>(initialHistory);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectForms, setRejectForms] = useState<Record<string, boolean>>({});
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [archivePage, setArchivePage] = useState(1);
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveFilter, setArchiveFilter] = useState<"all" | "APPROVED" | "REJECTED">("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<HistoryUser | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* Auto-refresh pending every 5s */
  useEffect(() => {
    const iv = setInterval(() => {
      getPendingRegistrations().then(r => { if (r.data) setPending(r.data); });
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  /* Counts */
  const approvedCount = history.filter(u => u.approvalStatus === "APPROVED").length;
  const rejectedCount = history.filter(u => u.approvalStatus === "REJECTED").length;
  const totalReports  = history.length;
  const approvedRate  = totalReports > 0
    ? ((approvedCount / totalReports) * 100).toFixed(1) + "%"
    : "0%";

  /* Archive filtered */
  const archiveFiltered = useMemo(() => {
    return history.filter(u => {
      const matchFilter = archiveFilter === "all" || u.approvalStatus === archiveFilter;
      const q = archiveSearch.toLowerCase();
      const matchSearch =
        !q ||
        (u.name?.toLowerCase().includes(q) ?? false) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [history, archiveSearch, archiveFilter]);

  const archiveTotalPages = Math.max(1, Math.ceil(archiveFiltered.length / PAGE_SIZE));
  const archivePaginated  = archiveFiltered.slice(
    (archivePage - 1) * PAGE_SIZE,
    archivePage * PAGE_SIZE
  );

  /* Approve */
  const handleApprove = async (userId: string) => {
    setLoadingId(userId);
    const res = await approveRegistration(userId);
    if (res.success) {
      setPending(prev => prev.filter(u => u.id !== userId));
      getRegistrationHistory().then(r => { if ("data" in r && r.data) setHistory(r.data); });
    }
    setLoadingId(null);
  };

  /* Reject */
  const handleReject = async (userId: string) => {
    setLoadingId(userId);
    const reason = rejectReasons[userId] ?? "";
    const res = await rejectRegistration(userId, reason);
    if (res.success) {
      setPending(prev => prev.filter(u => u.id !== userId));
      setRejectForms(prev => ({ ...prev, [userId]: false }));
      setRejectReasons(prev => ({ ...prev, [userId]: "" }));
      getRegistrationHistory().then(r => { if ("data" in r && r.data) setHistory(r.data); });
    }
    setLoadingId(null);
  };

  /* Export CSV archive */
  const handleExportCSV = () => {
    const rows = [
      ["Nama", "Email", "Role", "Status", "Tanggal Daftar", "Tanggal Proses", "Alasan Penolakan"],
      ...archiveFiltered.map(u => {
        const processed = u.approvalStatus === "APPROVED" ? u.approvedAt : u.rejectedAt;
        return [
          u.name ?? "-",
          u.email,
          u.role,
          u.approvalStatus,
          formatDate(u.createdAt),
          formatDate(processed),
          u.approvalReason ?? "-",
        ];
      }),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrasi-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Manual refresh */
  const handleRefresh = async () => {
    setRefreshing(true);
    const [p, h] = await Promise.all([getPendingRegistrations(), getRegistrationHistory()]);
    if (p.data) setPending(p.data);
    if ("data" in h && h.data) setHistory(h.data);
    setRefreshing(false);
  };

  /* Breakdown per role */
  const breakdown = useMemo(() => {
    const internApproved = history.filter(u => u.role === "INTERN" && u.approvalStatus === "APPROVED").length;
    const internRejected = history.filter(u => u.role === "INTERN" && u.approvalStatus === "REJECTED").length;
    const mentorApproved = history.filter(u => u.role === "MENTOR" && u.approvalStatus === "APPROVED").length;
    const mentorRejected = history.filter(u => u.role === "MENTOR" && u.approvalStatus === "REJECTED").length;
    return { internApproved, internRejected, mentorApproved, mentorRejected };
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review organizational performance and internship progress metrics.</p>
      </div>

      {/* Stat Cards — 4 kolom */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <BarChart2 className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-emerald-500">+12%</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Reports</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{totalReports.toLocaleString()}</p>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <ClipboardList className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-blue-500">{pending.length} New</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Pending Reviews</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{pending.length}</p>
        </div>

        {/* Approved Data */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Stable</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Approved Data</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{approvedRate}</p>
        </div>

        {/* Exported Files */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <Download className="h-5 w-5 text-violet-500" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Weekly</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Exported Files</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{approvedCount + rejectedCount}</p>
        </div>
      </div>

      {/* Breakdown per Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Intern breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">Intern Registration</p>
            <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
              {breakdown.internApproved + breakdown.internRejected} total
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Disetujui</span>
                <span className="font-semibold text-emerald-600">{breakdown.internApproved}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: breakdown.internApproved + breakdown.internRejected > 0 ? `${(breakdown.internApproved / (breakdown.internApproved + breakdown.internRejected)) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Ditolak</span>
                <span className="font-semibold text-rose-500">{breakdown.internRejected}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all"
                  style={{ width: breakdown.internApproved + breakdown.internRejected > 0 ? `${(breakdown.internRejected / (breakdown.internApproved + breakdown.internRejected)) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mentor breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">Mentor Registration</p>
            <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
              {breakdown.mentorApproved + breakdown.mentorRejected} total
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Disetujui</span>
                <span className="font-semibold text-emerald-600">{breakdown.mentorApproved}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: breakdown.mentorApproved + breakdown.mentorRejected > 0 ? `${(breakdown.mentorApproved / (breakdown.mentorApproved + breakdown.mentorRejected)) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Ditolak</span>
                <span className="font-semibold text-rose-500">{breakdown.mentorRejected}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all"
                  style={{ width: breakdown.mentorApproved + breakdown.mentorRejected > 0 ? `${(breakdown.mentorRejected / (breakdown.mentorApproved + breakdown.mentorRejected)) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report + Export CSV */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
          <BarChart2 className="h-4 w-4" />
          Generate New Report +
        </Button>
      </div>

      {/* ── Pending Registrations ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Pending Registrations</h2>
            <p className="text-xs text-slate-400 mt-0.5">Review and manage incoming applications for interns and mentors.</p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:underline">
            View All ({pending.length})
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mx-auto">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Semua registrasi sudah diproses</p>
            <p className="text-xs text-slate-400">Tidak ada registrasi intern atau mentor yang menunggu persetujuan saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 w-[40%]">Applicant</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[15%]">Type</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[20%]">Date Applied</th>
                  <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[25%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pending.map(user => {
                  const isLoading   = loadingId === user.id;
                  const showReject  = rejectForms[user.id];
                  const name        = user.name ?? "Tanpa Nama";

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      {/* Applicant */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold ${avatarColor(name)}`}>
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-600 font-medium">
                          {user.role === "INTERN" ? "Intern" : "Mentor"}
                        </span>
                      </td>

                      {/* Date Applied */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-slate-500">{timeAgo(user.createdAt)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        {showReject ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              placeholder="Alasan penolakan (opsional)"
                              value={rejectReasons[user.id] ?? ""}
                              onChange={e => setRejectReasons(prev => ({ ...prev, [user.id]: e.target.value }))}
                              className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-red-400 resize-none"
                            />
                            <div className="flex gap-1.5">
                              <Button size="sm" variant="outline" onClick={() => setRejectForms(prev => ({ ...prev, [user.id]: false }))} className="text-slate-500 text-xs">
                                Batal
                              </Button>
                              <Button size="sm" disabled={isLoading} onClick={() => handleReject(user.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1">
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                                Tolak
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleApprove(user.id)}
                              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold text-xs border border-emerald-200 gap-1 h-8"
                            >
                              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isLoading}
                              onClick={() => setRejectForms(prev => ({ ...prev, [user.id]: true }))}
                              className="border-red-200 text-red-500 hover:bg-red-50 text-xs gap-1 h-8"
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── All Reports Archive ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">All Reports Archive</h2>
              <p className="text-xs text-slate-400 mt-0.5">Riwayat registrasi yang telah diproses (disetujui atau ditolak).</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama / email..."
                  value={archiveSearch}
                  onChange={e => { setArchiveSearch(e.target.value); setArchivePage(1); }}
                  className="rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-44"
                />
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
                title="Refresh"
              >
                <RotateCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1">
            {([
              { id: "all",      label: "Semua",    count: history.length },
              { id: "APPROVED", label: "Disetujui", count: approvedCount },
              { id: "REJECTED", label: "Ditolak",   count: rejectedCount },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => { setArchiveFilter(tab.id); setArchivePage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  archiveFilter === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  archiveFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Archive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 w-[30%]">Nama / Email</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[10%]">Role</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[18%]">Tanggal Daftar</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[18%]">Tanggal Proses</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[12%]">Status</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-[12%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {archivePaginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    Tidak ada data riwayat.
                  </td>
                </tr>
              ) : (
                archivePaginated.map(user => {
                  const isApproved = user.approvalStatus === "APPROVED";
                  const processedDate = isApproved ? user.approvedAt : user.rejectedAt;
                  const name = user.name ?? "Tanpa Nama";

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      {/* Nama / Email */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold ${avatarColor(name)}`}>
                            {initials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-600 font-medium">
                          {user.role === "INTERN" ? "Intern" : "Mentor"}
                        </span>
                      </td>

                      {/* Tanggal Daftar */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-slate-500">{formatDate(user.createdAt)}</p>
                      </td>

                      {/* Tanggal Proses */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-slate-500">{formatDate(processedDate)}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isApproved ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                        }`}>
                          {isApproved ? "Disetujui" : "Ditolak"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 relative">
                          <button
                            onClick={() => setDetailUser(user)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                            {openMenuId === user.id && (
                              <div className="absolute right-0 top-8 z-20 w-36 bg-white rounded-xl border border-slate-100 shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                <button onClick={() => { setDetailUser(user); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition">
                                  <Eye className="h-3.5 w-3.5" /> View Details
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 transition">
                                  <Download className="h-3.5 w-3.5" /> Download
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Showing {((archivePage - 1) * PAGE_SIZE) + 1}–{Math.min(archivePage * PAGE_SIZE, archiveFiltered.length)} of {archiveFiltered.length} reports
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setArchivePage(p => Math.max(1, p - 1))}
              disabled={archivePage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: Math.min(archiveTotalPages, 5) }, (_, i) => {
              let p: number;
              if (archiveTotalPages <= 5)                   p = i + 1;
              else if (archivePage <= 3)                    p = i + 1;
              else if (archivePage >= archiveTotalPages - 2) p = archiveTotalPages - 4 + i;
              else                                          p = archivePage - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setArchivePage(p)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition ${
                    p === archivePage ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            {archiveTotalPages > 5 && archivePage < archiveTotalPages - 2 && (
              <>
                <span className="text-slate-400 text-xs px-1">…</span>
                <button onClick={() => setArchivePage(archiveTotalPages)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                  {archiveTotalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setArchivePage(p => Math.min(archiveTotalPages, p + 1))}
              disabled={archivePage === archiveTotalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {openMenuId && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}

      {/* ── Detail Modal ── */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Detail Registrasi</h3>
              <button onClick={() => setDetailUser(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${avatarColor(detailUser.name ?? "?")}`}>
                  {initials(detailUser.name)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{detailUser.name ?? "Tanpa Nama"}</p>
                  <p className="text-xs text-slate-500">{detailUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Role</p>
                  <p className="font-semibold text-slate-700 text-xs">{detailUser.role === "INTERN" ? "Intern" : "Mentor"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    detailUser.approvalStatus === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                  }`}>
                    {detailUser.approvalStatus === "APPROVED" ? "Disetujui" : "Ditolak"}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Tanggal Daftar</p>
                  <p className="font-semibold text-slate-700 text-xs">{formatDate(detailUser.createdAt)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Tanggal Proses</p>
                  <p className="font-semibold text-slate-700 text-xs">
                    {formatDate(detailUser.approvalStatus === "APPROVED" ? detailUser.approvedAt : detailUser.rejectedAt)}
                  </p>
                </div>
              </div>

              {detailUser.approvalStatus === "REJECTED" && detailUser.approvalReason && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                  <p className="text-xs font-semibold text-rose-600 mb-0.5">Alasan Penolakan</p>
                  <p className="text-xs text-rose-700">{detailUser.approvalReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
