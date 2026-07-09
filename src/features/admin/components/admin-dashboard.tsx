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
  user: { id: string; name: string | null };
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
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        <CheckCircle className="h-2.5 w-2.5" /> Disetujui
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
        <AlertCircle className="h-2.5 w-2.5" /> Ditolak
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
      <Clock className="h-2.5 w-2.5" /> Menunggu
    </span>
  );
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
      if (result.error) setError(result.error);
      else if (result.data) setData(result.data);
    } catch {
      setError("Gagal refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getDashboardStats().then((r) => { if (r.data) setData(r.data); });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    // --- Ikhtisar ---
    {
      label: "Total Pendaftar",
      value: data.totalApplicants,
      unit: "orang",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/admin/applicants",
      alert: false
    },
    {
      label: "Intern Aktif",
      value: data.activeInterns,
      unit: "orang",
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      href: "/admin/interns",
      alert: false
    },
    {
      label: "Intern Selesai",
      value: data.completedInterns,
      unit: "orang",
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      href: "/admin/interns",
      alert: false
    },
    {
      label: "Total Mentor",
      value: data.totalMentors,
      unit: "mentor",
      icon: UserCheck,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      href: "/admin/mentors",
      alert: false
    },
    {
      label: "Sertifikat",
      value: data.totalCertificates,
      unit: "diterbitkan",
      icon: Award,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      href: "/admin/reports",
      alert: false
    },
    // --- Butuh tindakan ---
    {
      label: "Menunggu Approval",
      value: data.pendingApprovals,
      unit: "akun",
      icon: Bell,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      href: "/admin/applicants",
      alert: data.pendingApprovals > 0
    },
    {
      label: "Logbook Pending",
      value: data.pendingLogbooks,
      unit: "entri",
      icon: ClipboardList,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      href: "/admin/monitoring",
      alert: data.pendingLogbooks > 0
    }
  ];

  const quickActions = [
    { label: "Approval Registrasi",    desc: "Setujui/tolak akun baru",         href: "/admin/applicants",           badge: data.pendingApprovals > 0 ? data.pendingApprovals : null },
    { label: "Seleksi Berkas",         desc: "Tinjau CV dan lamaran intern",     href: "/admin/applicants",           badge: null },
    { label: "Tugaskan Mentor",        desc: "Assign mentor ke peserta magang",  href: "/admin/interns",              badge: null },
    { label: "Kelola Program Magang",  desc: "Tambah atau tutup posisi magang",  href: "/admin/internship-programs",  badge: null },
    { label: "Monitoring Logbook",     desc: "Pantau aktivitas harian peserta",  href: "/admin/monitoring",           badge: data.pendingLogbooks > 0 ? data.pendingLogbooks : null }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Admin</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ikhtisar sistem magang LEXA hari ini.</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      {/* Stat Cards — single uniform grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative group flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                item.alert ? "border-orange-200 bg-orange-50/40" : "border-slate-100"
              }`}
            >
              {item.alert && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              )}
              <div className={`w-fit rounded-lg p-2 ${item.iconBg} ${item.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-2xl font-bold tracking-tight ${item.alert ? "text-orange-600" : "text-slate-800"}`}>
                  {item.value}
                </p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-tight">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom — Logbook feed + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Logbook Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Logbook Terbaru</h2>
              <p className="text-xs text-slate-400 mt-0.5">5 entri terbaru dari peserta magang.</p>
            </div>
            <Link href="/admin/monitoring" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition">
              Lihat Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {data.latestLogbooks.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                Belum ada aktivitas logbook terdaftar.
              </div>
            ) : (
              data.latestLogbooks.map((log) => (
                <div key={log.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition">
                  {/* Avatar */}
                  <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {log.user.name?.[0]?.toUpperCase() ?? "I"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">{log.user.name ?? "—"}</span>
                      <LogbookStatusBadge status={log.status} />
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{log.activity}</p>
                  </div>

                  {/* Right — date + progress */}
                  <div className="shrink-0 text-right space-y-1 min-w-[80px]">
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(new Date(log.date))}
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-16 bg-slate-200 rounded-full h-1 overflow-hidden">
                        <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${log.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600">{log.progress}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-800">Aksi Cepat</h2>
            <p className="text-xs text-slate-400 mt-0.5">Navigasi ke halaman yang sering digunakan.</p>
          </div>
          <div className="divide-y divide-slate-50">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {action.badge !== null && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                      {action.badge}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
