"use client";

import { useState } from "react";
import {
  Megaphone, Plus, Trash2, Pencil, X, CheckCircle,
  AlertCircle, Globe, Users, UserCheck, Calendar, Clock, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  deleteAnnouncementAction,
  getAnnouncements
} from "../services/announcement.actions";

interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: string;
  status: string;
  eventDate: Date | null;
  eventTime: string | null;
  meetLink: string | null;
  createdAt: Date;
  author: { name: string | null };
}

const AUDIENCE_CFG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  all:     { label: "Semua",  icon: <Globe className="h-3 w-3" />,     color: "bg-blue-100 text-blue-700"      },
  interns: { label: "Intern", icon: <Users className="h-3 w-3" />,     color: "bg-emerald-100 text-emerald-700" },
  mentors: { label: "Mentor", icon: <UserCheck className="h-3 w-3" />, color: "bg-indigo-100 text-indigo-700"  },
};

function toInputDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

export function AnnouncementManager({ initialData }: Readonly<{ initialData: Announcement[] }>) {
  const [items, setItems]       = useState<Announcement[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Announcement | null>(null);

  // Form fields
  const [title,     setTitle]     = useState("");
  const [message,   setMessage]   = useState("");
  const [audience,  setAudience]  = useState("all");
  const [status,    setStatus]    = useState("published");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [meetLink,  setMeetLink]  = useState("");

  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setTitle(""); setMessage(""); setAudience("all"); setStatus("published");
    setEventDate(""); setEventTime(""); setMeetLink("");
    setError(null); setSuccess(false); setShowForm(true);
  };

  const openEdit = (item: Announcement) => {
    setEditing(item);
    setTitle(item.title); setMessage(item.message);
    setAudience(item.audience); setStatus(item.status);
    setEventDate(toInputDate(item.eventDate));
    setEventTime(item.eventTime ?? "");
    setMeetLink(item.meetLink ?? "");
    setError(null); setSuccess(false); setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const data = { title, message, audience, status, eventDate, eventTime, meetLink };
      const res = editing
        ? await updateAnnouncementAction(editing.id, data)
        : await createAnnouncementAction(data);

      if ("error" in res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        const refreshed = await getAnnouncements();
        if (refreshed.data) setItems(refreshed.data as Announcement[]);
        setTimeout(() => { closeForm(); setSuccess(false); }, 1200);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    setDeletingId(id);
    const res = await deleteAnnouncementAction(id);
    if ("success" in res && res.success) setItems((prev) => prev.filter((i) => i.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} pengumuman</p>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm">
          <Plus className="h-4 w-4" /> Buat Pengumuman
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-800">
                {editing ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
              </h3>
              <button onClick={closeForm} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
                <p className="font-semibold text-slate-700">
                  {editing ? "Berhasil diperbarui!" : "Pengumuman terkirim!"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                {/* Judul */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul *</label>
                  <input
                    value={title} onChange={(e) => setTitle(e.target.value)} required
                    placeholder="Judul pengumuman..."
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Pesan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Pesan *</label>
                  <textarea
                    value={message} onChange={(e) => setMessage(e.target.value)} required rows={4}
                    placeholder="Isi pengumuman..."
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>

                {/* Tanggal & Waktu Pelaksanaan */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    Waktu Pelaksanaan <span className="text-slate-400 font-normal">(opsional)</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Tanggal</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Waktu
                      </label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        placeholder="09.00 - 11.00 WIB"
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                      />
                    </div>
                  </div>

                  {/* Link Meet */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <Link2 className="h-3 w-3" /> Link Discord / Google Meet
                    </label>
                    <input
                      type="url"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/... atau https://discord.gg/..."
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                    />
                  </div>
                </div>

                {/* Penerima & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Penerima</label>
                    <select value={audience} onChange={(e) => setAudience(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 bg-white">
                      <option value="all">Semua</option>
                      <option value="interns">Intern saja</option>
                      <option value="mentors">Mentor saja</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 bg-white">
                      <option value="published">Publish Sekarang</option>
                      <option value="draft">Simpan Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={closeForm}>Batal</Button>
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Kirim Pengumuman"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Belum ada pengumuman.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const aud = AUDIENCE_CFG[item.audience] ?? AUDIENCE_CFG.all;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title + badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${aud.color}`}>
                        {aud.icon}{aud.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{item.message}</p>

                    {/* Event info */}
                    {(item.eventDate || item.eventTime || item.meetLink) && (
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {item.eventDate && (
                          <span className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.eventDate).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                            {item.eventTime && ` · ${item.eventTime}`}
                          </span>
                        )}
                        {item.meetLink && (
                          <a
                            href={item.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold hover:underline"
                          >
                            <Link2 className="h-3 w-3" />
                            {item.meetLink.includes("discord") ? "Discord" : "Google Meet"}
                          </a>
                        )}
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 mt-1.5">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                      {item.author.name && ` · ${item.author.name}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
