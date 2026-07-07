"use client";

import { useState } from "react";
import { User, KeyRound, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfileAction, changePasswordAction } from "../services/profile.actions";

type ProfileFormProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    approvalStatus: string;
  };
};

export function ProfileForm({ user }: Readonly<ProfileFormProps>) {
  // Edit name state
  const [name, setName] = useState(user.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const roleLabel =
    user.role === "MENTOR" ? "Mentor" : user.role === "INTERN" ? "Intern" : user.role;

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameLoading(true);
    setNameError(null);
    setNameSuccess(false);

    const res = await updateProfileAction({ name });

    if (res.error) {
      setNameError(res.error);
    } else {
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    }

    setNameLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(false);

    const res = await changePasswordAction({ currentPassword, newPassword, confirmPassword });

    if (res.error) {
      setPwError(res.error);
    } else {
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(false), 4000);
    }

    setPwLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header / Avatar Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-extrabold text-white shrink-0">
            {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {user.name ?? user.email}
            </h1>
            <p className="text-blue-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-xs font-bold text-white">
                <Shield className="h-3 w-3" />
                {roleLabel}
              </span>
              <span className="text-blue-200 text-xs">Bergabung {joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Edit Nama</h2>
            <p className="text-xs text-slate-500">Perbarui nama tampilan akun Anda</p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="profile-name" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Nama Lengkap
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap..."
              className="w-full max-w-md rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {nameError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600 max-w-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{nameError}</span>
            </div>
          )}

          {nameSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm text-emerald-600 max-w-md">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Nama berhasil diperbarui!</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={nameLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            {nameLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <KeyRound className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Ganti Password</h2>
            <p className="text-xs text-slate-500">Pastikan password baru minimal 8 karakter</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label htmlFor="current-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Password Saat Ini
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini..."
              className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="new-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Password Baru
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter..."
              className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru..."
              className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {pwError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{pwError}</span>
            </div>
          )}

          {pwSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm text-emerald-600">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Password berhasil diubah!</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={pwLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            {pwLoading ? "Memproses..." : "Ganti Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
