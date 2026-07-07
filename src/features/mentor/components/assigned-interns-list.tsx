"use client";

import { useState } from "react";
import { Users, Search, ClipboardList, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Logbook = {
  id: string;
  date: Date;
  activity: string;
  progress: number;
  status: string;
};

type Evaluation = {
  finalScore: number;
  technicalScore: number;
  attitudeScore: number;
  communicationScore: number;
  attendanceScore: number;
};

type Certificate = {
  certNumber: string;
  issuedAt: Date;
};

type Program = {
  title: string;
  period: string | null;
};

type Application = {
  program: Program;
};

type InternDetail = {
  id: string;
  name: string | null;
  email: string;
  internEvaluation: Evaluation | null;
  certificate: Certificate | null;
  applications: Application[];
  logbooks: Logbook[];
};

type AssignedInternsListProps = {
  interns: InternDetail[];
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-100";
  if (score >= 60) return "bg-amber-50 border-amber-100";
  return "bg-red-50 border-red-100";
}

function getLogbookStatusColor(status: string): string {
  if (status === "approved") return "bg-emerald-500";
  if (status === "rejected") return "bg-red-500";
  return "bg-amber-400";
}

export function AssignedInternsList({ interns }: Readonly<AssignedInternsListProps>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = interns.filter((intern) => {
    const q = searchQuery.toLowerCase();
    return (
      intern.name?.toLowerCase().includes(q) ||
      intern.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span>Peserta Magang Bimbingan</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Pantau perkembangan dan aktivitas peserta magang yang Anda bimbing.
            </p>
          </div>
          <span className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold shrink-0">
            {interns.length} Peserta
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau email peserta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
      </div>

      {/* Interns Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          {interns.length === 0 ? (
            <>
              <p className="text-slate-600 font-semibold text-sm">Belum ada peserta magang bimbingan Anda.</p>
              <p className="text-slate-400 text-xs mt-1">Admin akan menugaskan peserta kepada Anda.</p>
            </>
          ) : (
            <p className="text-slate-500 font-medium text-sm">
              Tidak ada peserta yang cocok dengan pencarian &quot;{searchQuery}&quot;.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((intern) => {
            const hasGraduated = !!intern.certificate;
            const programTitle =
              intern.applications[0]?.program.title ?? "Belum mendaftar program";

            return (
              <div
                key={intern.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-4"
              >
                {/* Bio + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-base shrink-0">
                      {intern.name?.[0]?.toUpperCase() ?? intern.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">
                        {intern.name ?? "(Tanpa Nama)"}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{intern.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                      hasGraduated
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {hasGraduated ? "Lulus ✓" : "Aktif"}
                  </span>
                </div>

                {/* Program */}
                <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    Program
                  </p>
                  <p className="text-sm font-semibold text-slate-700 truncate">{programTitle}</p>
                </div>

                {/* Recent Logbooks */}
                {intern.logbooks.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      5 Logbook Terbaru
                    </p>
                    <div className="space-y-1.5">
                      {intern.logbooks.map((log) => (
                        <div key={log.id} className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${getLogbookStatusColor(log.status)}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] text-slate-500 truncate">
                                {new Date(log.date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short"
                                })}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600 shrink-0">
                                {log.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${log.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <ClipboardList className="h-4 w-4 shrink-0" />
                    <span>Belum ada logbook yang dikirim.</span>
                  </div>
                )}

                {/* Evaluation Summary */}
                {intern.internEvaluation ? (
                  <div className={`rounded-xl p-4 border ${getScoreBg(intern.internEvaluation.finalScore)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Nilai Akhir
                      </p>
                      <span
                        className={`text-2xl font-extrabold ${getScoreColor(intern.internEvaluation.finalScore)}`}
                      >
                        {intern.internEvaluation.finalScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                      <div>
                        Teknis:{" "}
                        <span className="font-bold text-slate-700">
                          {intern.internEvaluation.technicalScore}
                        </span>
                      </div>
                      <div>
                        Sikap:{" "}
                        <span className="font-bold text-slate-700">
                          {intern.internEvaluation.attitudeScore}
                        </span>
                      </div>
                      <div>
                        Komunikasi:{" "}
                        <span className="font-bold text-slate-700">
                          {intern.internEvaluation.communicationScore}
                        </span>
                      </div>
                      <div>
                        Kehadiran:{" "}
                        <span className="font-bold text-slate-700">
                          {intern.internEvaluation.attendanceScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-slate-400 italic">
                    Belum dievaluasi
                  </div>
                )}

                {/* Quick Links */}
                <div className="flex gap-2 pt-1">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                  >
                    <Link href="/mentor/logbook-review">
                      <ClipboardList className="h-3.5 w-3.5 mr-1" />
                      Review Logbook →
                    </Link>
                  </Button>
                  {!intern.internEvaluation && (
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                    >
                      <Link href="/mentor/evaluation">
                        <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-300" />
                        Beri Nilai →
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
