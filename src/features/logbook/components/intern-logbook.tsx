"use client";

import { useState } from "react";
import { ClipboardList, Plus, Calendar, AlertCircle, CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react";
import { createLogbookAction } from "../services/logbook.actions";
import { Button } from "@/components/ui/button";

type LogbookEntry = {
  id: string;
  date: Date;
  activity: string;
  progress: number;
  status: string;
  feedback: string | null;
};

type InternLogbookProps = {
  initialLogbooks: LogbookEntry[];
};

export function InternLogbook({ initialLogbooks }: Readonly<InternLogbookProps>) {
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(initialLogbooks);
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [isAdding, setIsAdding] = useState(false);
  const [activity, setActivity] = useState("");
  const [progress, setProgress] = useState(50);
  const [logDate, setLogDate] = useState(today);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) {
      setError("Deskripsi aktivitas tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createLogbookAction({ activity, progress, date: logDate });
      if (res.error) {
        setError(res.error);
      } else {
        // Optimistically append new logbook
        const newLog: LogbookEntry = {
          id: Math.random().toString(),
          date: logDate ? new Date(logDate) : new Date(),
          activity,
          progress,
          status: "pending",
          feedback: null
        };
        setLogbooks((prev) => [newLog, ...prev]);
        setActivity("");
        setProgress(50);
        setLogDate(today);
        setIsAdding(false);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan logbook.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <span>Logbook Harian</span>
          </h1>
          <p className="text-sm text-slate-500">Laporkan aktivitas magang harian Anda dan pantau evaluasi mentor.</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 font-medium text-white flex items-center gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            <span>Isi Logbook Hari Ini</span>
          </Button>
        )}
      </div>

      {/* Add Logbook Form Panel */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-bold text-slate-800">Isi Aktivitas Harian</h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition"
            >
              <Calendar className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="log-date">
              Tanggal Aktivitas
            </label>
            <input
              id="log-date"
              type="date"
              value={logDate}
              max={today}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="log-activity">
              Detail Aktivitas / Pekerjaan
            </label>
            <textarea
              id="log-activity"
              rows={4}
              placeholder="Jelaskan apa yang Anda kerjakan hari ini secara spesifik..."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="log-progress">Progress Tugas Hari Ini</label>
              <span className="text-blue-600 font-bold">{progress}% Completed</span>
            </div>
            <input
              id="log-progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 px-1">
              <span>0% (Baru Mulai)</span>
              <span>50% (Setengah Jalan)</span>
              <span>100% (Selesai)</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 font-medium text-white"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Logbook"}
            </Button>
          </div>
        </form>
      )}

      {/* Logbook History */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Laporan Logbook</h2>
        
        {logbooks.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ClipboardList className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Belum ada laporan aktivitas.</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk melaporkan aktivitas pertama Anda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logbooks.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition duration-200 animate-in fade-in duration-300"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {new Date(log.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 self-start sm:self-center ${
                      log.status === "approved"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : log.status === "rejected"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {log.status === "approved" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : log.status === "rejected" ? (
                      <XCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>
                      {log.status === "approved"
                        ? "Disetujui"
                        : log.status === "rejected"
                        ? "Ditolak"
                        : "Menunggu Review"}
                    </span>
                  </span>
                </div>

                {/* Activity & progress */}
                <div className="space-y-3">
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{log.activity}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress Pekerjaan</span>
                      <span className="font-bold text-slate-700">{log.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${log.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mentor feedback */}
                {log.feedback && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-start gap-2.5">
                    <MessageSquare className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Catatan Pembimbing:</p>
                      <p className="text-xs text-slate-700 italic">&quot;{log.feedback}&quot;</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
