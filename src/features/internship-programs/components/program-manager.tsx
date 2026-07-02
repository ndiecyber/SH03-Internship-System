"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, FileText, X, AlertCircle } from "lucide-react";
import { createProgramAction, updateProgramAction, deleteProgramAction } from "../services/program.actions";
import { Button } from "@/components/ui/button";

type Program = {
  id: string;
  title: string;
  description: string;
  status: string;
  period: string | null;
  _count: { applications: number };
};

type ProgramManagerProps = {
  initialPrograms: Program[];
};

export function ProgramManager({ initialPrograms }: Readonly<ProgramManagerProps>) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState("published");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPeriod("");
    setStatus("published");
    setIsAdding(false);
    setEditingId(null);
    setError(null);
  };

  const handleEditClick = (program: Program) => {
    setEditingId(program.id);
    setTitle(program.title);
    setDescription(program.description);
    setPeriod(program.period ?? "");
    setStatus(program.status);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError("Judul program harus diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = { title, description, period, status };

    try {
      if (editingId) {
        const res = await updateProgramAction(editingId, data);
        if (res.error) {
          setError(res.error);
        } else {
          setPrograms((prev) =>
            prev.map((p) =>
              p.id === editingId
                ? { ...p, ...data, _count: p._count }
                : p
            )
          );
          resetForm();
        }
      } else {
        const res = await createProgramAction(data);
        if (res.error) {
          setError(res.error);
        } else {
          // Simplest is to reload page or append, let's append a dummy id for UI responsiveness
          setPrograms((prev) => [
            {
              id: Math.random().toString(),
              ...data,
              _count: { applications: 0 }
            },
            ...prev
          ]);
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus program ini? Semua pendaftaran terkait akan ikut terhapus.")) {
      return;
    }

    try {
      const res = await deleteProgramAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus program.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Lowongan Magang</h1>
          <p className="text-sm text-slate-500">Kelola daftar program magang yang tersedia untuk pendaftar.</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 font-medium text-white flex items-center gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Program</span>
          </Button>
        )}
      </div>

      {/* Form Panel (Create / Edit) */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-bold text-slate-800">
              {editingId ? "Edit Program Magang" : "Tambah Program Magang Baru"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="p-title">
                Nama Program / Posisi
              </label>
              <input
                id="p-title"
                type="text"
                placeholder="Contoh: Frontend Web Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="p-period">
                Periode Magang
              </label>
              <input
                id="p-period"
                type="text"
                placeholder="Contoh: Juli - Desember 2026"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="p-desc">
              Deskripsi Program
            </label>
            <textarea
              id="p-desc"
              rows={3}
              placeholder="Deskripsikan tanggung jawab, kualifikasi, atau skill yang dipelajari..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="p-status">
              Status Lowongan
            </label>
            <select
              id="p-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="published">Published (Aktif & Terbuka)</option>
              <option value="draft">Draft (Disembunyikan)</option>
              <option value="closed">Closed (Ditutup)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 font-medium text-white"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Program"}
            </Button>
          </div>
        </form>
      )}

      {/* Program Vacancy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length === 0 ? (
          <div className="col-span-full bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Belum ada program magang.</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol Tambah Program untuk membuat program pertama.</p>
          </div>
        ) : (
          programs.map((program) => (
            <div
              key={program.id}
              className="flex flex-col bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 group"
            >
              <div className="flex justify-between items-start gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    program.status === "published"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : program.status === "draft"
                      ? "bg-amber-50 text-amber-600 border border-amber-100"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                  }`}
                >
                  {program.status}
                </span>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-200">
                  <button
                    onClick={() => handleEditClick(program)}
                    className="p-1.5 rounded-md border border-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                    title="Edit Program"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="p-1.5 rounded-md border border-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                    title="Hapus Program"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition mb-1 line-clamp-1">
                {program.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                <Calendar className="h-3.5 w-3.5" />
                <span>{program.period || "Tidak ditentukan"}</span>
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                {program.description || "Tidak ada deskripsi."}
              </p>

              <div className="border-t pt-4 flex justify-between items-center text-xs text-slate-500">
                <span>Pendaftar Aktif</span>
                <span className="font-bold text-slate-800 text-sm">
                  {program._count?.applications || 0} orang
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
