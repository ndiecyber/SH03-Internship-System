"use client";

import { useState } from "react";
import { User, Info, BookOpen, ChevronDown, ChevronUp, Shield } from "lucide-react";

type AdminSettingsProps = {
  admin: {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
  };
  nodeEnv: string;
};

const adminResponsibilities = [
  "Menyetujui/menolak registrasi Intern & Mentor",
  "Mengelola program magang yang tersedia",
  "Meninjau berkas dan lamaran peserta magang",
  "Memantau logbook harian peserta",
  "Menugaskan mentor kepada peserta magang"
];

export function AdminSettings({ admin, nodeEnv }: Readonly<AdminSettingsProps>) {
  const [panduan, setPanduan] = useState(false);

  const joinedDate = new Date(admin.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const isProduction = nodeEnv === "production";

  return (
    <div className="space-y-6">
      {/* Profil Admin */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Profil Admin</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Nama</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{admin.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{admin.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</p>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              <Shield className="h-3 w-3" />
              ADMIN
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Bergabung Sejak</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{joinedDate}</p>
          </div>
        </div>

        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
          Untuk mengubah data akun admin, hubungi superadmin sistem.
        </p>
      </div>

      {/* Informasi Sistem */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <Info className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Informasi Sistem</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Nama Aplikasi</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">LEXA Internship Management System</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Versi</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">1.0.0</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Tech Stack</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">Next.js 15, Prisma ORM, Supabase PostgreSQL</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Environment</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isProduction
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isProduction ? "Production" : "Development"}
            </span>
          </div>
        </div>
      </div>

      {/* Panduan Singkat */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <button
          onClick={() => setPanduan((prev) => !prev)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50">
              <BookOpen className="h-5 w-5 text-violet-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Panduan Singkat Admin</h2>
          </div>
          {panduan ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>

        {panduan && (
          <div className="border-t border-slate-100 px-6 pb-5 pt-4">
            <p className="mb-3 text-sm text-slate-500">Tanggung jawab utama sebagai Admin sistem:</p>
            <ul className="space-y-2">
              {adminResponsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
