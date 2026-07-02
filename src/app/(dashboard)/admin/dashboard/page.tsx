import { createPageMetadata } from "@/utils/create-page-metadata";
import { prisma } from "@/lib/db";
import { Users, BookOpen, CheckCircle, Award, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata("Admin Dashboard");

export default async function AdminDashboardPage() {
  // Fetch stats dynamically from database
  const totalApplicants = await prisma.application.count();
  
  const activeInterns = await prisma.user.count({
    where: {
      role: "INTERN",
      applications: { some: { status: "approved" } },
      certificate: null // Not graduated/completed yet
    }
  });

  const completedInterns = await prisma.user.count({
    where: {
      role: "INTERN",
      certificate: { isNot: null }
    }
  });

  const totalCertificates = await prisma.certificate.count();

  // Fetch 5 latest logbooks
  const latestLogbooks = await prisma.logbook.findMany({
    take: 5,
    orderBy: { date: "desc" },
    include: {
      user: true
    }
  });

  const stats = [
    {
      label: "Pendaftar",
      value: totalApplicants,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "On Progress",
      value: activeInterns,
      icon: BookOpen,
      color: "from-indigo-600 to-violet-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      label: "Selesai",
      value: completedInterns,
      icon: CheckCircle,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      label: "Sertifikat",
      value: totalCertificates,
      icon: Award,
      color: "from-sky-600 to-blue-600",
      textColor: "text-sky-600",
      bgColor: "bg-sky-50"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-sans tracking-tight">Dashboard Admin</h1>
        <p className="text-sm text-slate-500 mt-1">Selamat datang kembali! Berikut ikhtisar sistem magang LEXA hari ini.</p>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
            >
              {/* Subtle background glow on hover */}
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition duration-300 blur-xl`} />

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                <div className={`rounded-xl p-2.5 ${item.bgColor} ${item.textColor} transition duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{item.value}</span>
                <span className="text-xs text-slate-400 font-medium ml-2">orang</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Logbook Feed Card */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4 border-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Logbook Terbaru</h2>
                <p className="text-xs text-slate-500">Laporan aktivitas harian terbaru dari para peserta magang.</p>
              </div>
              <Link
                href="/admin/monitoring"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {latestLogbooks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Belum ada aktivitas logbook terdaftar.
                </div>
              ) : (
                latestLogbooks.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition duration-200"
                  >
                    {/* User profile and activity details */}
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 self-start">
                        {log.user.name?.[0] || "I"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{log.user.name}</h4>
                        <p className="text-slate-600 text-xs line-clamp-1 pr-4">{log.activity}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(log.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar widget */}
                    <div className="w-full sm:w-36 space-y-1.5 shrink-0">
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
        </div>

        {/* Shortcuts Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-4 border-slate-50">Aksi Cepat Admin</h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Seleksi Berkas Pendaftar", href: "/admin/applicants", desc: "Tinjau CV dan berkas baru" },
              { label: "Kelola Program Lowongan", href: "/admin/internship-programs", desc: "Tambah/tutup posisi magang" },
              { label: "Monitoring Progress Harian", href: "/admin/monitoring", desc: "Pantau pengerjaan logbook" }
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col p-4 rounded-xl border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/30 transition duration-200 text-left"
              >
                <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">
                  {action.label}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">{action.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
