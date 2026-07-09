"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboard.actions";
import {
  Users, BookOpen, CheckCircle, Award, Calendar,
  ArrowRight, RefreshCw, AlertCircle, Clock, UserCheck,
  ClipboardList, Bell
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";

interface Logbook {
  id: string;
  activity: string;
  date: Date;
  progress: number;
  status: string;
  user: {
    id: string;
    name: string | null;
  };
}

interface DashboardData {
  totalApplicants: number;
  activeInterns: number;
  completedInterns: number;
  totalCertificates: number;
  pendingApprovals: number;
  totalMentors: number;
  pendingLogbooks: number;
  latestLogbooks: Logbook[];
}

interface AdminDashboardProps {
  initialData: DashboardData;
}

function LogbookStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          <CheckCircle className="h-2.5 w-2.5" />
          Disetujui
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
          <AlertCircle className="h-2.5 w-2.5" />
          Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          <Clock className="h-2.5 w-2.5" />
          Menunggu
        </span>
      );
  }
}

export function AdminDashboard({ initialData }: Readonly<AdminDashboardProps>) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardStats();
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Gagal refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getDashboardStats().then((result) => {
        if (result.data) setData(result.data);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Row 1 — overview stats
  const statsRow1 = [
    {
      label: "Total Pendaftar",
      value: data.totalApplicants,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/applicants"
    },
    {
      label: "Intern Aktif",
      value: data.activeInterns,
      icon: BookOpen,
      color: "from-indigo-600 to-violet-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/admin/interns"
    },
    {
      label: "Intern Selesai",
      value: data.completedInterns,
      icon: CheckCircle,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/admin/interns"
    },
    {
      label: "Sertifikat",
      value: data.totalCertificates,
      icon: Award,
      color: "from-sky-600 to-blue-600",
      textColor: "text-sky-600",
      bgColor: "bg-sky-50",
      href: "/admin/reports"
    }
  ];

  // Row 2 — action-required stats
  const statsRow2 = [
    {
      label: "Menunggu Approval",
      value: data.pendingApprovals,
      icon: Bell,
      color: "from-orange-500 to-amber-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/applicants",
      alert: data.pendingApprovals > 0
    },
    {
      label: "Logbook Pending",
      value: data.pendingLogbooks,
      icon: ClipboardList,
      color: "from-amber-500 to-yellow-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/admin/monitoring",
      alert: data.pendingLogbooks > 0
    },
    {
      label: "Total Mentor",
      value: data.totalMentors,
      icon: UserCheck,
      color: "from-violet-600 to-purple-600",
      textColor: "text-violet-600",
      bgColor: "bg-violet-50",
      href: "/admin/mentors",
      alert: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang kembali! Berikut ikhtisar sistem magang LEXA hari ini.</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      {/* Row 1 — 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsRow1.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition duration-300 blur-xl`} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                <div className={`rounded-xl p-2.5 ${item.bgColor} ${item.textColor} transition duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{item.value}</span>
                <span className="text-xs text-slate-400 font-medium">orang</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Row 2 — 3 action-required cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statsRow2.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
              style={{ borderColor: item.alert ? "rgb(251 191 36 / 0.4)" : "rgb(241 245 249)" }}
            >
              {item.alert && (
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              )}
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition duration-300 blur-xl`} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                <div className={`rounded-xl p-2.5 ${item.bgColor} ${item.textColor} transition duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold tracking-tight ${item.alert ? "text-orange-600" : "text-slate-800"}`}>
                  {item.value}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {item.label === "Total Mentor" ? "mentor" : item.alert ? "perlu tindakan" : "selesai"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logbook Feed */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b pb-4 border-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Logbook Terbaru</h2>
              <p className="text-xs text-slate-500 mt-0.5">Laporan aktivitas harian terbaru dari para peserta magang.</p>
            </div>
            <Link
              href="/admin/monitoring"
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
            >
              Lihat Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {data.latestLogbooks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Belum ada aktivitas logbook terdaftar.
              </div>
            ) : (
              data.latestLogbooks.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition duration-200"
                >
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 self-start">
                      {log.user.name?.[0]?.toUpperCase() || "I"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-800 text-sm">{log.user.name ?? "—"}</h4>
                        <LogbookStatusBadge status={log.status} />
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{log.activity}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(log.date))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-32 space-y-1 shrink-0">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Progress</span>
                      <span className="font-bold text-slate-700">{log.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${log.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-4 border-slate-50">Aksi Cepat</h2>
          <div className="space-y-2.5">
            {[
              {
                label: "Approval Registrasi",
                href: "/admin/applicants",
                desc: "Setujui/tolak akun baru",
                badge: data.pendingApprovals > 0 ? data.pendingApprovals : null
              },
              {
                label: "Seleksi Berkas Pendaftar",
                href: "/admin/applicants",
                desc: "Tinjau CV dan berkas lamaran",
                badge: null
              },
              {
                label: "Tugaskan Mentor",
                href: "/admin/interns",
                desc: "Assign mentor ke peserta magang",
                badge: null
              },
              {
                label: "Kelola Program Magang",
                href: "/admin/internship-programs",
                desc: "Tambah atau tutup posisi magang",
                badge: null
              },
              {
                label: "Monitoring Logbook",
                href: "/admin/monitoring",
                desc: "Pantau aktivitas harian peserta",
                badge: data.pendingLogbooks > 0 ? data.pendingLogbooks : null
              }
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/30 transition duration-200"
              >
                <div>
                  <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition block">
                    {action.label}
                  </span>
                  <span className="text-xs text-slate-400">{action.desc}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {action.badge !== null && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                      {action.badge}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
