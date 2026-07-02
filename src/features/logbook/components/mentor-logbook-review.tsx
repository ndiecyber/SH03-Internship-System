"use client";

import { useState } from "react";
import { ClipboardList, Calendar, Check, X, Search, MessageSquare } from "lucide-react";
import { reviewLogbookAction } from "../services/logbook.actions";
import { Button } from "@/components/ui/button";

type Intern = {
  id: string;
  name: string | null;
  email: string;
};

type LogbookEntry = {
  id: string;
  userId: string;
  date: Date;
  activity: string;
  progress: number;
  status: string;
  feedback: string | null;
  user: Intern;
};

type MentorLogbookReviewProps = {
  initialLogbooks: LogbookEntry[];
};

export function MentorLogbookReview({ initialLogbooks }: Readonly<MentorLogbookReviewProps>) {
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(initialLogbooks);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    setIsSubmitting(true);
    const feedback = feedbackNotes[id] || "";

    try {
      const res = await reviewLogbookAction(id, status, feedback);
      if (res.error) {
        alert(res.error);
      } else {
        setLogbooks((prev) =>
          prev.map((log) => (log.id === id ? { ...log, status, feedback } : log))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses logbook.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackChange = (id: string, val: string) => {
    setFeedbackNotes((prev) => ({ ...prev, [id]: val }));
  };

  const filteredLogs = logbooks.filter((log) => {
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesSearch =
      log.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-bold text-slate-800">Review Logbook Magang</h1>
        <p className="text-sm text-slate-500">Tinjau laporan aktivitas harian yang dikirimkan oleh peserta magang bimbingan Anda.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama intern atau detail aktivitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "pending", label: "Pending Review" },
            { id: "approved", label: "Disetujui" },
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

      {/* Logbooks Review list */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ClipboardList className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Tidak ada logbook yang cocok dengan filter.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 space-y-4"
            >
              {/* Top Meta info */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3 border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                    {log.user.name?.[0] || "I"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{log.user.name}</h3>
                    <p className="text-[10px] text-slate-400">{log.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {new Date(log.date).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Activity Details & Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktivitas Dilaporkan:</p>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{log.activity}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress Laporan:</p>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-1.5">
                    <span>{log.progress}% Selesai</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${log.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action / Review block */}
              <div className="border-t pt-4">
                {log.status === "pending" ? (
                  <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-1 w-full space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider" htmlFor={`fb-${log.id}`}>
                        Berikan Feedback / Catatan Pembimbing
                      </label>
                      <input
                        id={`fb-${log.id}`}
                        type="text"
                        placeholder="Contoh: Sangat bagus, pastikan kode sudah di-commit..."
                        value={feedbackNotes[log.id] || ""}
                        onChange={(e) => handleFeedbackChange(log.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-1.5 px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                      <Button
                        onClick={() => handleReview(log.id, "approved")}
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 py-4 px-3"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Setujui</span>
                      </Button>
                      <Button
                        onClick={() => handleReview(log.id, "rejected")}
                        disabled={isSubmitting}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold text-xs flex items-center gap-1 py-4 px-3"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Tolak</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-2 text-xs">
                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Feedback Mentor: </span>
                        <span className="text-slate-700 italic">&quot;{log.feedback || "Tidak ada feedback."}&quot;</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border self-start sm:self-center ${
                        log.status === "approved"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-red-50 border-red-200 text-red-600"
                      }`}
                    >
                      {log.status === "approved" ? "Disetujui" : "Ditolak"}
                    </span>
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
