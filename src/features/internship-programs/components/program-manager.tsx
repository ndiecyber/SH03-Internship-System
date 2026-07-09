"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, FileText, X, AlertCircle, Loader2, CheckCircle } from "lucide-react";
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

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  published: { label: "Aktif",    className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  draft:     { label: "Draft",    className: "bg-amber-50 text-amber-600 border-amber-100" },
  closed:    { label: "Ditutup",  className: "bg-slate-50 text-slate-500 border-slate-200" }
};

export function ProgramManager({ initialPrograms }: Readonly<ProgramManagerProps>) {
  const [programs, setPrograms]       = useState<Program[]>(initialPrograms);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Form states
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod]           = useState("");
  const [status, setStatus]           = useState("published");

  const openAdd = () => {
    setTitle(""); setDescription(""); setPeriod(""); setStatus("published");
    setEditingId(null); setError(null); setModalOpen(true);
  };

  const openEdit = (p: Program) => {
    setTitle(p.title); setDescription(p.description);
    setPeriod(p.period ?? ""); setStatus(p.status);
    setEditingId(p.id); setError(null); setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false); setEditingId(null); setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Judul program wajib diisi."); return; }

    setIsSubmitting(true); setError(null);
    const data = { title: title.trim(), description: description.trim(), period: period.trim(), status };

    try {
      if (editingId) {
        const res = await updateProgramAction(editingId, data);
        if (res.error) { setError(res.error); return; }
        setPrograms((prev) => prev.map((p) => p.id === editingId ? { ...p, ...data } : p));
      } else {
        const res = await createProgramAction(data);
        if (res.error) { setError(res.error); return; }
        setPrograms((prev) => [{ id: Math.random().toString(), ...data, _count: { applications: 0 } }, ...prev]);
      }
      closeModal();
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteProgramAction(deleteId);
      if (res.error) { alert(res.error); return; }
      setPrograms((prev) => prev.filter((p) => p.id !== deleteId));
    } catch {
      alert("Gagal menghapus program.");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Lowongan Magang</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola program magang yang tersedia — {programs.length} program terdaftar.
          </p>
        </div>
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start shrink-0">
          <Plus className="h-4 w-4" /> Tambah Program
        </Button>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.length === 0 ? (
          <div className="col-span-full border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Belum ada program magang.</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol Tambah Program untuk membuat program pertama.</p>
          </div>
        ) : (
          programs.map((program) => {
            const st = STATUS_LABEL[program.status] ?? STATUS_LABEL.draft;
            return (
              <div key={program.id} className="flex flex-col bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200">
                {/* Top row: status + actions */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.className}`}>
                    {st.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(program)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                      title="Edit Program"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(program.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                      title="Hapus Program"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{program.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{program.period || "Periode tidak ditentukan"}</span>
                </div>

                <p className="text-slate-500 text-sm line-clamp-3 flex-1 mb-4">
                  {program.description || "Tidak ada deskripsi."}
                </p>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Total Pendaftar</span>
                  <span className="text-sm font-bold text-slate-700">{program._count?.applications ?? 0} orang</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingId ? "Edit Program Magang" : "Tambah Program Magang"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId ? "Perbarui informasi program magang." : "Isi detail program magang baru."}
                </p>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="p-title">
                    Nama Program / Posisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="p-title"
                    type="text"
                    placeholder="Contoh: Frontend Web Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="p-period">
                    Periode Magang
                  </label>
                  <input
                    id="p-period"
                    type="text"
                    placeholder="Juli - Desember 2026"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="p-status">
                    Status
                  </label>
                  <select
                    id="p-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  >
                    <option value="published">Aktif (Terbuka)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                    <option value="closed">Ditutup</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="p-desc">
                    Deskripsi Program
                  </label>
                  <textarea
                    id="p-desc"
                    rows={4}
                    placeholder="Deskripsikan tanggung jawab, kualifikasi, atau skill yang dipelajari..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={closeModal} className="text-slate-600">
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4" /> {editingId ? "Simpan Perubahan" : "Buat Program"}</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Hapus Program?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Semua pendaftaran yang terkait dengan program ini juga akan ikut terhapus.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting} className="text-slate-600">
                Batal
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
              >
                {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</> : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
