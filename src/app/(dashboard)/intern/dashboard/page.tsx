import { createPageMetadata } from "@/utils/create-page-metadata";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  GraduationCap,
  NotebookPen,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata("Intern Dashboard");

const summaryCards = [
  {
    label: "Status Magang",
    value: "Aktif",
    note: "Program berjalan sesuai jadwal",
    icon: GraduationCap,
  },
  {
    label: "Logbook Minggu Ini",
    value: "4/5",
    note: "Satu catatan perlu dilengkapi",
    icon: NotebookPen,
  },
  {
    label: "Progress",
    value: "68%",
    note: "Target pembelajaran bulan ini",
    icon: TrendingUp,
  },
  {
    label: "Sisa Hari",
    value: "24",
    note: "Menuju akhir periode magang",
    icon: CalendarDays,
  },
];

const quickActions = [
  {
    href: "/intern/logbook",
    label: "Isi Logbook",
    description: "Catat aktivitas dan kendala harian.",
    icon: ClipboardList,
  },
  {
    href: "/intern/progress",
    label: "Lihat Progress",
    description: "Pantau capaian tugas dan evaluasi.",
    icon: TrendingUp,
  },
  {
    href: "/intern/internship-registration",
    label: "Data Registrasi",
    description: "Periksa data program dan penempatan.",
    icon: FileText,
  },
];

const timelineItems = [
  {
    time: "09.00",
    title: "Standup bersama mentor",
    description: "Update pekerjaan, blocker, dan target hari ini.",
  },
  {
    time: "13.30",
    title: "Pengerjaan tugas utama",
    description: "Lanjutkan modul yang sudah ditugaskan mentor.",
  },
  {
    time: "16.00",
    title: "Submit logbook",
    description: "Lengkapi ringkasan aktivitas sebelum pulang.",
  },
];

const requirements = [
  "Lengkapi profil peserta",
  "Isi logbook harian",
  "Pantau progress mingguan",
  "Unduh sertifikat saat program selesai",
];

export default function InternDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border bg-background">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">
                Dashboard Peserta Magang
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold text-foreground">
                Selamat datang, pantau kegiatan magang kamu dari sini.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Lihat status program, isi logbook, pantau progress, dan akses
                kebutuhan utama selama magang.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/intern/logbook">
                  <NotebookPen className="mr-2 h-4 w-4" />
                  Isi Logbook
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/intern/progress">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Cek Progress
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Mentor Pembimbing</p>
                <p className="text-sm text-muted-foreground">
                  Belum ditampilkan dari database
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Divisi</span>
                <span className="font-medium">Product Development</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Periode</span>
                <span className="font-medium">Jun - Agu 2026</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="rounded-lg border bg-background p-5"
              key={card.label}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.note}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Aksi Cepat</h2>
            <p className="text-sm text-muted-foreground">
              Pintasan ke aktivitas yang paling sering dipakai peserta.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  className="group rounded-lg border bg-background p-5 transition-colors hover:border-primary/40 hover:bg-accent"
                  href={action.href}
                  key={action.href}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold group-hover:text-accent-foreground">
                    {action.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Checklist Peserta</h2>
                <p className="text-sm text-muted-foreground">
                  Hal yang perlu dijaga selama program berjalan.
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {requirements.map((item) => (
                <div
                  className="flex items-center gap-3 rounded-md border bg-muted/30 p-3"
                  key={item}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Agenda Hari Ini</h2>
              <p className="text-sm text-muted-foreground">
                Rencana kerja yang perlu diperhatikan.
              </p>
            </div>
            <Clock3 className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 space-y-4">
            {timelineItems.map((item) => (
              <div className="flex gap-3" key={`${item.time}-${item.title}`}>
                <div className="w-14 shrink-0 text-sm font-medium text-primary">
                  {item.time}
                </div>
                <div className="min-w-0 border-l pl-4">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
