"use client";

import { useState } from "react";
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { deleteUser } from "../services/user-management.actions";
import { Trash2, Loader2, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";

interface Application {
  id: string;
  status: string;
  cvUrl: string | null;
  createdAt: Date;
  program: { title: string };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  approvalStatus: string;
  createdAt: Date;
  approvedAt: Date | null;
  applications?: Application[];
}

interface UserListProps {
  users: User[];
  roleLabel: string;
  onRefresh?: () => void;
}

function getApplicationBadge(applications?: Application[]) {
  const app = applications?.[0];

  if (!app) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
        Belum mendaftar program
      </span>
    );
  }

  switch (app.status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <CheckCircle className="h-3.5 w-3.5" />
          Peserta Aktif — {app.program.title}
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <XCircle className="h-3.5 w-3.5" />
          Berkas Ditolak — {app.program.title}
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          <Clock className="h-3.5 w-3.5" />
          Menunggu Review Berkas — {app.program.title}
        </span>
      );
    default:
      return null;
  }
}

export function UserList({ users, roleLabel, onRefresh }: Readonly<UserListProps>) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      return;
    }

    setIsLoading(userId);
    const result = await deleteUser(userId);
    setIsLoading(null);

    if (result.success) {
      onRefresh?.();
    }
  };

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
        <p className="text-sm text-slate-500">Tidak ada {roleLabel} yang terdaftar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900">{user.name || "Nama tidak tersedia"}</h3>
              <p className="text-sm text-slate-600 truncate">{user.email}</p>

              <div className="mt-2 space-y-1.5">
                {/* Application status - PROMINENT */}
                {getApplicationBadge(user.applications)}

                {/* CV link if available and pending review */}
                {user.applications?.[0]?.cvUrl && user.applications[0].status === "pending" && (
                  <a
                    href={user.applications[0].cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Lihat CV di Google Drive
                  </a>
                )}

                {/* Account status + join date - secondary info */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400">
                    Akun:{" "}
                    <span
                      className={
                        user.approvalStatus === "APPROVED"
                          ? "text-emerald-600 font-medium"
                          : "text-slate-500"
                      }
                    >
                      {user.approvalStatus}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Daftar: {formatDate(new Date(user.createdAt))}
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(user.id)}
              disabled={isLoading === user.id}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {isLoading === user.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Hapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
