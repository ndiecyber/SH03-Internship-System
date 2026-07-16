"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboard.actions";
import {
  Users, UserPlus, Award, ArrowRight,
  AlertCircle, Clock, FileText, UserCheck,
  Calendar, Square, FilePlus, BarChart3
} from "lucide-react";
import Link from "next/link";
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
interface ChartPoint { date: string; onGoing: number; completed: number; }
interface PiePoint { name: string; value: number; }
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

/* ─── Helpers ─────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  approved: { label: "Accepted", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  pending:  { label: "Pending",  className: "bg-amber-100 text-amber-700" },
};
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-slate-100 text-slate-600" };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${cfg.className}`}>{cfg.label}</span>;
}
function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Stat Card ──────────────────────────────── */
interface StatCardProps { label: string; value: number; icon: React.ReactNode; iconBg: string; href: string; }
function StatCard({ label, value, icon, iconBg, href }: Readonly<StatCardProps>) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-500 leading-tight whitespace-nowrap">{label}</p>
        <p className="text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
      </div>
    </Link>
  );
}

/* ─── Chart Tooltip ──────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="mb-1 font-bold text-slate-700">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────── */
export function AdminDashboard({ initialData }: Readonly<{ initialData: DashboardData }>) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      getDashboardStats().then((r) => {
        if ("error" in r && r.error) setError(r.error);
        else if ("data" in r && r.data) setData(r.data as DashboardData);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const stats: StatCardProps[] = [
    { label: "Total Interns",    value: data.completedInterns + data.activeInterns, icon: <Users className="h-4 w-4 text-white" />,    iconBg: "bg-blue-500",   href: "/admin/interns" },
    { label: "Active Programs",  value: data.programPieData.find((p) => p.name === "On Going")?.value ?? 0, icon: <FileText className="h-4 w-4 text-white" />,   iconBg: "bg-indigo-800", href: "/admin/internship-programs" },
    { label: "On Going Interns", value: data.activeInterns,    icon: <UserCheck className="h-4 w-4 text-white" />, iconBg: "bg-green-600",  href: "/admin/interns" },
    { label: "Completed",        value: data.completedInterns, icon: <Award className="h-4 w-4 text-white" />,     iconBg: "bg-purple-500", href: "/admin/interns" },
  ];

  const activePrograms = data.programPieData.find((p) => p.name === "On Going")?.value ?? 0;
  const pieData = [
    { name: "On Going",  value: data.activeInterns,    color: "#3b82f6" },
    { name: "Completed", value: data.completedInterns, color: "#10b981" },
  ].filter((d) => d.value > 0);
  const pieTotal = pieData.reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Welcome back, Admin LEXA!</h1>
          <p className="text-xs text-slate-500">Here&apos;s what&apos;s happening with your internship programs today.</p>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {dateStr}
        </span>
      </div>

      {/* ── Main 2-column: LEFT content + RIGHT side panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-3 items-start">

        {/* ── LEFT ── */}
        <div className="space-y-3 min-w-0">

          {/* Stat Cards — 4 card mengisi penuh lebar kolom kiri */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* Area Chart */}
            <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Interns Overview</h2>
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">20 Jun – 20 Oct 2026</span>
              </div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />On Going</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Completed</span>
              </div>
              <ResponsiveContainer width="100%" height={155}>
                <AreaChart data={data.internChartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOnGoing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="onGoing" name="On Going" stroke="#3b82f6" strokeWidth={2} fill="url(#colorOnGoing)" dot={{ r: 2, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fill="url(#colorCompleted)" dot={{ r: 2, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 mb-2">Program Status</h2>
              {pieTotal === 0 ? (
                <div className="flex flex-1 items-center justify-center text-xs text-slate-400">No data</div>
              ) : (
                <>
                  <div className="relative flex items-center justify-center" style={{ height: 140 }}>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                          {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-slate-800 leading-none">{activePrograms}</span>
                      <span className="text-[9px] font-semibold tracking-widest text-slate-400">Programs</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {pieData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: entry.color }} />
                          <span className="text-[11px] font-medium text-slate-600">{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{entry.value}</span>
                          <span className="text-[10px] text-slate-400">{Math.round((entry.value / pieTotal) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Recent Applications</h2>
                <p className="text-[10px] text-slate-400">Latest 5 applications</p>
              </div>
              <Link href="/admin/applicants" className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {data.latestApplications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-400">No applications yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/60">
                      {["Name", "Program", "Applied Date", "Status", "Action"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.latestApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {app.user.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate max-w-[100px]">{app.user.name ?? "—"}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{app.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2"><p className="font-medium text-slate-700 truncate max-w-[130px]">{app.program.title}</p></td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                        <td className="px-3 py-2"><StatusBadge status={app.status} /></td>
                        <td className="px-3 py-2">
                          <Link href="/admin/applicants" className="inline-flex items-center rounded-md border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition">Review</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* ── END LEFT ── */}

        {/* ── RIGHT side panel ── */}
        <div className="flex flex-col gap-3">

          {/* Upcoming Schedule */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-bold text-slate-800">Upcoming Schedule</h2>
              <Link href="/admin/reports" className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 transition">View Calendar</Link>
            </div>
            <div className="space-y-2.5">
              {[
                { day: "26", month: "JUN", title: "Opening Ceremony", sub: "Batch 4", time: "10.00 - 11.00 WIB", type: "Online" },
                { day: "01", month: "JUN", title: "Onboarding Session", sub: "Batch 4", time: "09.00 - 11.00 WIB", type: "Online" },
                { day: "05", month: "JUN", title: "Mentor Meeting", sub: "All Program", time: "10.00 - 11.00 WIB", type: "Online" },
              ].map((ev) => (
                <div key={ev.day + ev.title} className="flex items-start gap-2.5">
                  {/* Tanggal */}
                  <div className="flex flex-col items-center justify-center shrink-0 w-8">
                    <span className="text-sm font-extrabold text-slate-800 leading-none">{ev.day}</span>
                    <span className="text-[9px] font-bold text-blue-600 uppercase">{ev.month}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 leading-tight">{ev.title}</p>
                    <p className="text-[10px] text-slate-400">{ev.sub}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                      <span className="text-[9px] text-slate-400">{ev.time}</span>
                      <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">{ev.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks & To Do */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-bold text-slate-800">Tasks & To Do</h2>
              <Link href="/admin/reports" className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 transition">View All</Link>
            </div>
            <div className="space-y-2">
              {[
                { task: "Review new applications", count: data.pendingApprovals, due: null, done: false },
                { task: "Review logbooks this week", count: data.pendingLogbooks, due: null, done: false },
                { task: "Mentor set up with Batch 2", count: null, due: "Tomorrow", done: false },
                { task: "Evaluate intern progress", count: null, due: null, done: false },
                { task: "Prepare closing report", count: null, due: "In 3 days", done: false },
              ].map((t) => (
                <div key={t.task} className="flex items-center gap-2">
                  <Square className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  <span className="flex-1 text-[11px] text-slate-600 leading-tight">{t.task}</span>
                  {t.count !== null && t.count > 0 && (
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-600">{t.count}</span>
                  )}
                  {t.due && (
                    <span className={`text-[9px] font-semibold ${t.due === "Tomorrow" ? "text-amber-500" : "text-slate-400"}`}>{t.due}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links — 4 horizontal */}
          {/* Quick Links — 4 icon horizontal tanpa card */}
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-2.5">Quick Links</h2>
            <div className="flex items-start justify-between gap-1">
              {[
                { label: "Add Intern",      href: "/admin/reports",             icon: <UserPlus className="h-4 w-4 text-blue-500" />,    bg: "bg-blue-100"    },
                { label: "Create Program",  href: "/admin/internship-programs", icon: <FilePlus className="h-4 w-4 text-indigo-500" />,  bg: "bg-indigo-100"  },
                { label: "Add Mentor",      href: "/admin/mentors",             icon: <UserCheck className="h-4 w-4 text-emerald-500" />,bg: "bg-emerald-100" },
                { label: "Generate Report", href: "/admin/monitoring",          icon: <BarChart3 className="h-4 w-4 text-amber-500" />,  bg: "bg-amber-100"   },
              ].map((ql) => (
                <Link key={ql.label} href={ql.href} className="flex flex-col items-center gap-1.5 flex-1 text-center hover:opacity-80 transition">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${ql.bg}`}>{ql.icon}</div>
                  <span className="text-[9px] font-semibold text-slate-500 leading-tight">{ql.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-xl overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)" }}>
            <div className="flex items-end justify-between px-3 pt-3 pb-0 gap-1">
              {/* Text + Button */}
              <div className="pb-3 flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Need help?</p>
                <p className="text-[10px] text-slate-500 mt-0.5 mb-2 leading-relaxed">
                  Check our documentation or<br />contact support team.
                </p>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-blue-600 shadow-sm hover:bg-blue-50 transition"
                >
                  Go to Help Center <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
              {/* Ilustrasi */}
              <div className="shrink-0 self-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/help-illustration.png"
                  alt="Help"
                  className="h-16 w-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </div>
          </div>

        </div>
        {/* ── END RIGHT ── */}

      </div>

      {/* Footer */}
      <p className="text-center text-[11px] pt-2" style={{ color: "#94A3B8" }}>
        © 2026 LEXA Software House. All rights reserved.
      </p>

    </div>
  );
}
