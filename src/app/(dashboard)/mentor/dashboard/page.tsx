import { createPageMetadata } from "@/utils/create-page-metadata";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Users, ClipboardList, CheckSquare, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata("Mentor Dashboard");

export default async function MentorDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Mentor";
  const userId = session?.user?.id;

  // Count assigned interns
  const totalInterns = userId
    ? await prisma.mentorIntern.count({ where: { mentorId: userId } })
    : 0;

  // Get assigned intern IDs
  const assignments = userId
    ? await prisma.mentorIntern.findMany({ where: { mentorId: userId }, select: { internId: true } })
    : [];
  const internIds = assignments.map((a) => a.internId);

  // Count pending logbooks
  const pendingLogs = internIds.length > 0
    ? await prisma.logbook.count({ where: { userId: { in: internIds }, status: "pending" } })
    : 0;

  // Count reviewed logbooks
  const reviewedLogs = internIds.length > 0
    ? await prisma.logbook.count({ where: { userId: { in: internIds }, status: { in: ["approved", "rejected"] } } })
    : 0;

  // Fetch 3 latest logbooks from assigned interns
  const latestLogs = internIds.length > 0
    ? await prisma.logbook.findMany({
        where: { userId: { in: internIds } },
        take: 3,
        orderBy: { date: "desc" },
        include: { user: true }
      })
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Halo, Pak/Bu {userName}!</h1>
        <p className="text-blue-100 text-sm mt-1 max-w-xl">
          Anda memiliki {totalInterns} peserta magang aktif bimbingan Anda. Tinjau aktivitas harian mereka secara berkala.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Peserta Bimbingan</p>
            <p className="text-2xl font-bold text-slate-800">{totalInterns} Orang</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-amber-50 text-amber-600 shrink-0">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logbook Pending</p>
            <p className="text-2xl font-bold text-slate-800">{pendingLogs} Laporan</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 shrink-0">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logbook Direview</p>
            <p className="text-2xl font-bold text-slate-800">{reviewedLogs} Laporan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest logbooks feed */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b pb-4 border-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Laporan Logbook Terbaru</h2>
              <p className="text-xs text-slate-500">Laporan aktivitas dari peserta bimbingan Anda.</p>
            </div>
            <Link
              href="/mentor/logbook-review"
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <span>Review Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Belum ada laporan dari peserta bimbingan Anda.
              </div>
            ) : (
              latestLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{log.user.name}</h4>
                    <p className="text-slate-600 text-xs line-clamp-1 pr-4">{log.activity}</p>
                  </div>
                  
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-center ${
                      log.status === "approved"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : log.status === "rejected"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {log.status === "approved" ? "Disetujui" : log.status === "rejected" ? "Ditolak" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4 border-slate-50">Menu Evaluasi</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Setelah program magang selesai, Anda wajib memberikan penilaian nilai akhir bagi setiap peserta magang untuk merilis sertifikat kelulusan mereka.
            </p>
          </div>
          <Link
            href="/mentor/evaluation"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center text-xs py-3 rounded-lg block flex items-center justify-center gap-1"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Beri Penilaian Akhir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
