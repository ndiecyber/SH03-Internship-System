import { createPageMetadata } from "@/utils/create-page-metadata";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ClipboardList, CheckCircle, BookOpen, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata("Intern Dashboard");

export default async function InternDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Intern";
  const userId = session?.user?.id;

  // Fetch counts
  const totalLogs = userId
    ? await prisma.logbook.count({ where: { userId } })
    : 0;

  const approvedLogs = userId
    ? await prisma.logbook.count({ where: { userId, status: "approved" } })
    : 0;

  const application = userId
    ? await prisma.application.findFirst({
        where: { userId, status: "approved" },
        include: { program: true }
      })
    : null;

  const hasCertificate = userId
    ? await prisma.certificate.findUnique({ where: { userId } })
    : null;

  const logbooks = userId
    ? await prisma.logbook.findMany({
        where: { userId },
        take: 3,
        orderBy: { date: "desc" }
      })
    : [];

  const averageProgress =
    logbooks.length > 0
      ? Math.round(logbooks.reduce((acc, curr) => acc + curr.progress, 0) / logbooks.length)
      : 0;

  // Fetch assigned mentor
  const mentorAssignment = userId
    ? await prisma.mentorIntern.findUnique({
        where: { internId: userId },
        include: { mentor: { select: { id: true, name: true, email: true } } }
      })
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Halo, {userName}!</h1>
        <p className="text-blue-100 text-sm mt-1 max-w-xl">
          {application
            ? `Anda terdaftar di program magang "${application.program.title}". Laporkan aktivitas harian Anda tepat waktu.`
            : "Silakan mendaftar program magang aktif pada menu Pendaftaran di bilah navigasi."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 shrink-0">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logbook Dikirim</p>
            <p className="text-2xl font-bold text-slate-800">{totalLogs} Laporan</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logbook Disetujui</p>
            <p className="text-2xl font-bold text-slate-800">{approvedLogs} Laporan</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-indigo-50 text-indigo-600 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rata-rata Progress</p>
            <p className="text-2xl font-bold text-slate-800">{averageProgress}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-sky-50 text-sky-600 shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sertifikat Kelulusan</p>
            <p className="text-sm font-bold text-slate-800 mt-1">
              {hasCertificate ? (
                <span className="text-emerald-600">Sudah Rilis</span>
              ) : (
                <span className="text-slate-400">Belum Tersedia</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest entries */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b pb-4 border-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Laporan Aktivitas Terakhir</h2>
              <p className="text-xs text-slate-500">Daftar logbook harian yang baru saja Anda laporkan.</p>
            </div>
            <Link
              href="/intern/logbook"
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <span>Isi Baru</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {logbooks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Belum ada aktivitas dilaporkan. Klik &quot;Isi Baru&quot; untuk memulai.
              </div>
            ) : (
              logbooks.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">
                      {new Date(log.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                    <p className="text-sm text-slate-700 font-medium line-clamp-1">{log.activity}</p>
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
                    {log.status === "approved"
                      ? "Disetujui"
                      : log.status === "rejected"
                      ? "Ditolak"
                      : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right sidebar: Mentor card + Info card */}
        <div className="flex flex-col gap-6">
          {/* Mentor Card */}
          {mentorAssignment ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800 border-b pb-3 border-slate-50">
                Pembimbing Anda
              </h2>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-extrabold shrink-0">
                  {mentorAssignment.mentor.name?.[0]?.toUpperCase() ??
                    mentorAssignment.mentor.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {mentorAssignment.mentor.name ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{mentorAssignment.mentor.email}</p>
                  <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-2">
              <h2 className="text-base font-bold text-slate-800 border-b pb-3 border-slate-50">
                Pembimbing Anda
              </h2>
              <p className="text-sm text-slate-500 pt-1">Belum ada mentor yang ditugaskan.</p>
              <p className="text-xs text-slate-400">
                Admin akan menugaskan pembimbing untuk Anda.
              </p>
            </div>
          )}

          {/* Petunjuk Logbook */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4 flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-base font-bold text-slate-800 border-b pb-3 border-slate-50">
                Petunjuk Logbook
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mt-3">
                Laporkan aktivitas magang Anda setiap hari kerja. Pastikan deskripsi pekerjaan ditulis
                dengan jelas dan terukur agar memudahkan pembimbing menilai perkembangan Anda.
              </p>
            </div>
            <Link
              href="/intern/logbook"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center text-xs py-3 rounded-lg block"
            >
              Tulis Laporan Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
