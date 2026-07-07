"use client";

import { useState } from "react";
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { deleteUser } from "../services/user-management.actions";
import { Trash2, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  approvalStatus: string;
  createdAt: Date;
  approvedAt: Date | null;
}

interface UserListProps {
  users: User[];
  roleLabel: string;
  onRefresh?: () => void;
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

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-medium text-emerald-700">Approved</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1">
            <Clock className="h-4 w-4 text-yellow-700" />
            <span className="text-xs font-medium text-yellow-700">Pending</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1">
            <XCircle className="h-4 w-4 text-red-700" />
            <span className="text-xs font-medium text-red-700">Rejected</span>
          </div>
        );
      default:
        return null;
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
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                {getApprovalBadge(user.approvalStatus)}
                <span className="text-xs text-slate-500">
                  Daftar: {formatDate(new Date(user.createdAt))}
                </span>
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
