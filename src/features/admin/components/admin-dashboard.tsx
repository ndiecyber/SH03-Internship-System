"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboard.actions";
import {
  Users, BookOpen, Award,
  ArrowRight, RefreshCw, AlertCircle, TrendingUp,
  Clock, FileText, UserCheck, LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─── Types ─────────────────────────────────────── */
interface Application {
  id: string;
  status: string;
  createdAt: Date;
  cvUrl: string | null;
  user: { id: string; name: string | null; email: string };
  program: { title: string };
}

interface ChartPoint {
  date: string;
  onGoing: number;
  completed: number;
}

interface PiePoint {
  name: string;
  value: number;
}

interface DashboardData {
  totalApplicants: number;
  totalInterns: number;
  activeInterns: number;
  completedInterns: number;
  totalCertificates: number;
  pendingApprovals: number;
  totalMentors: number;
  pendingLogbooks: number;
  latestApplications: Application[];
  internChartData: ChartPoint[];
  programPieData: PiePoint[];
}

/* ─── Helpers ────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  approved: { label: "Accepted",  className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected",  className: "bg-red-100 text-red-700" },
  pending:  { label: "Pending",   className: "bg-amber-100 text-amber-700" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Stat Card ──────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  trend?: number;
}

function StatCard({ label, value, sub, icon, iconBg, href, trend }: Readonly<StatCardProps>) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-500">{label}</p>
        <div className="mt-1 flex items-center gap-1.5">
          {trend !== undefined && (
            <span className={`text-xs font-bold ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
          <span className="text-xs text-slate-400">{sub}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Custom Tooltip Recharts ─────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="mb-1.5 font-bold text-slate-700">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────── */
export function AdminDashboard({ initialData }: Readonly<{ initialData: DashboardData }>) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardStats();
      if (result.error) setError(result.error);
      else if (result.data) setData(result.data as DashboardData);
    } catch {
      setError("Gagal refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getDashboardStats().then((r) => {
        if (r.data) setData(r.data as DashboardData);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  /* ── Stats ── */
  const stats: StatCardProps[] = [
    {
      label: "Total Interns",
      value: data.completedInterns + data.activeInterns ,    
      icon: <Users className="h-6 w-6 text-blue-600" />,
      iconBg: "bg-blue-50",
      href: "/admin/interns"
    },
    {
      label: "Active Programs",
      value: data.programPieData.find((p) => p.name === "On Going")?.value ?? 0,  
      icon: <LayoutGrid className="h-6 w-6 text-indigo-600" />,
      iconBg: "bg-indigo-50",
      href: "/admin/internship-programs"
    },
    {
      label: "On Going Interns",
      value: data.activeInterns,
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      href: "/admin/interns"
    },
    {
      label: "Completed",
      value: data.completedInterns,
      icon: <Award className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-50",
      href: "/admin/interns"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Welcome back, Admin LEXA! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {`Here's what's happening with your internship programs today.`}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Clock className="h-4 w-4 text-slate-400" />
            {dateStr}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area Chart — Interns Overview */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Interns Overview</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                20 June – 20 October 2026
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              On Going
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Completed
            </span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data.internChartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOnGoing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="onGoing"
                name="On Going"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#colorOnGoing)"
                dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#3b82f6" }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#colorCompleted)"
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Interns On Going vs Completed */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800">Program Status</h2>
          </div>

          {(() => {
            const activePrograms = data.programPieData.find((p) => p.name === "On Going")?.value ?? 0;
            const onGoingInterns  = data.activeInterns;
            const completedInterns = data.completedInterns;

            const pieData = [
              { name: "On Going",          value: onGoingInterns,   color: "#3b82f6" },
              { name: "Completed", value: completedInterns, color: "#10b981"},
            ].filter((d) => d.value > 0);

            const total = pieData.reduce((s, p) => s + p.value, 0);

            if (total === 0) {
              return (
                <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                  Belum ada data intern
                </div>
              );
            }

            return (
              <>
                {/* Donut + center label menggunakan overlay HTML */}
                <div className="relative flex items-center justify-center" style={{ height: 190 }}>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={84}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                        contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center label — overlay absolut di tengah donut */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800 leading-none">
                      {activePrograms}
                    </span>
                    <span className="text-[11px] font-semibold tracking-widest text-slate-400">
                      Programs
                    </span>                   
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-3 space-y-2">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ background: entry.color }}
                        />
                        <span className="text-xs font-medium text-slate-600">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{entry.value}</span>
                        <span className="text-xs text-slate-400">
                          {Math.round((entry.value / total) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* ── Bottom Row: Recent Applications + Quick Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Applications</h2>
              <p className="text-xs text-slate-400 mt-0.5">5 pendaftaran terbaru masuk</p>
            </div>
            <Link
              href="/admin/applicants"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {data.latestApplications.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">
              Belum ada pendaftaran masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/60">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Program
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Applied Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.latestApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition">
                      {/* Name */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {app.user.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[130px]">
                              {app.user.name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[130px]">
                              {app.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Program */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-700 truncate max-w-[160px] text-xs">
                          {app.program.title}
                        </p>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(app.createdAt)}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={app.status} />
                      </td>
                      {/* Action */}
                      <td className="px-4 py-3.5">
                        <Link
                          href="/admin/applicants"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Quick Stats + Quick Links */}
        <div className="flex flex-col gap-4">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-800">Quick Stats</h2>
            <div className="divide-y divide-slate-50">
              {[
                { icon: <FileText className="h-4 w-4 text-amber-500" />, label: "Pending Approvals", value: data.pendingApprovals, href: "/admin/reports", color: "text-amber-600" },
                { icon: <Clock className="h-4 w-4 text-blue-500" />, label: "Logbook Pending", value: data.pendingLogbooks, href: "/admin/monitoring", color: "text-blue-600" },
                { icon: <UserCheck className="h-4 w-4 text-indigo-500" />, label: "Total Mentors", value: data.totalMentors, href: "/admin/mentors", color: "text-indigo-600" },
                { icon: <Award className="h-4 w-4 text-emerald-500" />, label: "Certificates Issued", value: data.totalCertificates, href: "/admin/interns", color: "text-emerald-600" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between py-2.5 hover:opacity-80 transition"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-3">Quick Links</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Add Intern",   href: "/admin/reports",             icon: <Users className="h-5 w-5 text-blue-600" />,    bg: "bg-blue-50"   },
                { label: "Create Program", href: "/admin/internship-programs", icon: <LayoutGrid className="h-5 w-5 text-indigo-600" />, bg: "bg-indigo-50" },
                { label: "Add Mentor",   href: "/admin/mentors",             icon: <UserCheck className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50" },
                { label: "Generate Report", href: "/admin/monitoring",        icon: <FileText className="h-5 w-5 text-amber-600" />,  bg: "bg-amber-50"  },
              ].map((ql) => (
                <Link
                  key={ql.label}
                  href={ql.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-3 text-center hover:shadow-sm hover:border-slate-200 transition"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${ql.bg}`}>
                    {ql.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 leading-tight">{ql.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
            <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-sm font-bold text-blue-800">Need help?</p>
            <p className="text-xs text-blue-600 mt-0.5 mb-3">
              Check our documentation or contact support team.
            </p>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Go to Help Center <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
