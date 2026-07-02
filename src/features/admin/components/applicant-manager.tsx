"use client";

import { useState } from "react";
import { Users, Check, X, Search, Link as LinkIcon, MessageSquare } from "lucide-react";
import { reviewApplicationAction } from "../services/applicant.actions";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string | null;
  email: string;
};

type Program = {
  id: string;
  title: string;
};

type Application = {
  id: string;
  userId: string;
  programId: string;
  status: string;
  cvUrl: string | null;
  notes: string | null;
  createdAt: Date;
  user: User;
  program: Program;
};

type ApplicantManagerProps = {
  initialApplications: Application[];
};

export function ApplicantManager({ initialApplications }: Readonly<ApplicantManagerProps>) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (id: string, status: "approved" | "rejected", notes?: string) => {
    setIsSubmitting(true);
    try {
      const res = await reviewApplicationAction(id, status, notes);
      if (res.error) {
        alert(res.error);
      } else {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status, notes: notes || app.notes } : app))
        );
        setRejectingId(null);
        setRejectNotes("");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch =
      app.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-bold text-slate-800">Seleksi Peserta Magang</h1>
        <p className="text-sm text-slate-500">Tinjau CV dan kelayakan berkas dari para calon peserta magang.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau program magang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div className="flex gap-2 border-b md:border-b-0 pb-2 md:pb-0 overflow-x-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Diterima" },
            { id: "rejected", label: "Ditolak" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                filterStatus === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Applicants */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Tidak ada pendaftar magang ditemukan.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Applicant Bio & Program Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {app.user.name || "Nama tidak diisi"}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        app.status === "approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : app.status === "rejected"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {app.status === "approved"
                        ? "Diterima"
                        : app.status === "rejected"
                        ? "Ditolak"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs text-slate-500 border-b pb-3 border-slate-50">
                    <p>
                      Email: <span className="font-semibold text-slate-700">{app.user.email}</span>
                    </p>
                    <p>
                      Program: <span className="font-semibold text-slate-700">{app.program.title}</span>
                    </p>
                    <p>
                      Tanggal Daftar:{" "}
                      <span className="font-semibold text-slate-700">
                        {new Date(app.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </p>
                  </div>

                  {app.notes && (
                    <div className="text-sm text-slate-600 bg-slate-50/70 p-3 rounded-lg flex items-start gap-2 border border-slate-100">
                      <MessageSquare className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-0.5">Pesan/Motivasi:</p>
                        <p>{app.notes}</p>
                      </div>
                    </div>
                  )}

                  {app.cvUrl && (
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>Buka Tautan Lampiran CV</span>
                    </a>
                  )}
                </div>

                {/* Status Action Buttons */}
                {app.status === "pending" && (
                  <div className="flex sm:flex-row md:flex-col gap-2 self-start shrink-0">
                    {rejectingId === app.id ? (
                      <div className="space-y-2 w-full md:w-64">
                        <textarea
                          placeholder="Alasan penolakan..."
                          value={rejectNotes}
                          onChange={(e) => setRejectNotes(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
                          rows={2}
                        />
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRejectingId(null)}
                            className="text-xs text-slate-500 py-1"
                          >
                            Batal
                          </Button>
                          <Button
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => handleReview(app.id, "rejected", rejectNotes)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white py-1"
                          >
                            Tolak
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleReview(app.id, "approved")}
                          disabled={isSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Terima Peserta</span>
                        </Button>
                        <Button
                          onClick={() => setRejectingId(app.id)}
                          disabled={isSubmitting}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold text-xs flex items-center gap-1.5"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Tolak Berkas</span>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
