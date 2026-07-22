"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerInternGoogleDriveAction } from "../services/user-management.actions";

type Intern = { id: string; name: string | null; email: string; institution: string | null; studyProgram: string | null };

export function GoogleDriveInterns({ initialInterns }: { initialInterns: Intern[] }) {
  const [interns, setInterns] = useState(initialInterns);
  const [selected, setSelected] = useState<Intern | null>(null);
  const [folderUrl, setFolderUrl] = useState("");
  const [folderId, setFolderId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected) return; setLoading(true); setMessage(null);
    const result = await registerInternGoogleDriveAction({ internId: selected.id, folderUrl, folderId });
    setLoading(false);
    if (result.error) { setMessage(result.error); return; }
    setInterns(current => current.filter(intern => intern.id !== selected.id));
    setSelected(null); setFolderUrl(""); setFolderId("");
  };
  return <div className="space-y-6">
    <div className="rounded-2xl border bg-white p-6 shadow-sm"><h1 className="text-2xl font-bold text-slate-800">Intern Belum Terdaftar Google Drive</h1><p className="mt-1 text-sm text-slate-500">Catat folder Google Drive setiap intern tanpa integrasi API eksternal.</p></div>
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {interns.length === 0 ? <div className="p-14 text-center text-slate-500"><FolderPlus className="mx-auto mb-3 h-10 w-10 text-emerald-400" />Semua intern sudah terdaftar di Google Drive.</div> : <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-400"><tr><th className="p-4">Intern</th><th className="p-4">Pendidikan</th><th className="p-4">Aksi</th></tr></thead><tbody>{interns.map(intern => <tr className="border-t" key={intern.id}><td className="p-4"><p className="font-medium">{intern.name ?? "Tanpa Nama"}</p><p className="text-xs text-slate-500">{intern.email}</p></td><td className="p-4 text-slate-600">{intern.institution ?? "-"}<br /><span className="text-xs">{intern.studyProgram ?? ""}</span></td><td className="p-4"><Button size="sm" onClick={() => { setSelected(intern); setMessage(null); }} className="bg-blue-600"><FolderPlus className="mr-1 h-3.5 w-3.5" />Daftarkan</Button></td></tr>)}</tbody></table>}
    </div>
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div><h2 className="font-bold">Daftarkan Google Drive</h2><p className="text-sm text-slate-500">{selected.name ?? selected.email}</p></div>{message && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{message}</p>}<label className="block text-sm">Folder URL<input required type="url" value={folderUrl} onChange={e => setFolderUrl(e.target.value)} className="mt-1 w-full rounded border p-2" placeholder="https://drive.google.com/..." /></label><label className="block text-sm">Folder ID <span className="text-slate-400">(opsional)</span><input value={folderId} onChange={e => setFolderId(e.target.value)} className="mt-1 w-full rounded border p-2" /></label><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setSelected(null)}>Batal</Button><Button disabled={loading} type="submit" className="bg-blue-600">{loading ? "Menyimpan..." : "Simpan"}</Button></div></form></div>}
  </div>;
}
