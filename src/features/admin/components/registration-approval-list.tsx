"use client";

import { useState } from "react";
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { approveRegistration, rejectRegistration } from "../services/registration-approval.actions";
import { Check, X, Loader2 } from "lucide-react";

interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

interface RegistrationApprovalListProps {
  pendingUsers: PendingUser[];
  onRefresh?: () => void;
}

export function RegistrationApprovalList({ pendingUsers, onRefresh }: Readonly<RegistrationApprovalListProps>) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({});
  const [showRejectForm, setShowRejectForm] = useState<{ [key: string]: boolean }>({});

  const handleApprove = async (userId: string) => {
    setIsLoading(userId);
    const result = await approveRegistration(userId);
    setIsLoading(null);
    
    if (result.success) {
      onRefresh?.();
    }
  };

  const handleReject = async (userId: string) => {
    setIsLoading(userId);
    const reason = rejectReason[userId];
    const result = await rejectRegistration(userId, reason);
    setIsLoading(null);
    
    if (result.success) {
      setShowRejectForm({ ...showRejectForm, [userId]: false });
      setRejectReason({ ...rejectReason, [userId]: "" });
      onRefresh?.();
    }
  };

  if (pendingUsers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
        <p className="text-sm text-slate-500">Tidak ada registrasi yang menunggu persetujuan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingUsers.map((user) => (
        <div key={user.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{user.name || "Nama tidak tersedia"}</h3>
              <p className="text-sm text-slate-600">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {user.role}
                </span>
                <span className="text-xs text-slate-500">
                  Daftar: {formatDate(new Date(user.createdAt))}
                </span>
              </div>
            </div>
          </div>

          {showRejectForm[user.id] ? (
            <div className="space-y-3 border-t border-slate-200 pt-3">
              <textarea
                className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="Alasan penolakan (opsional)"
                value={rejectReason[user.id] || ""}
                onChange={(e) => setRejectReason({ ...rejectReason, [user.id]: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRejectForm({ ...showRejectForm, [user.id]: false })}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleReject(user.id)}
                  disabled={isLoading === user.id}
                >
                  {isLoading === user.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Tolak
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 border-t border-slate-200 pt-3">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApprove(user.id)}
                disabled={isLoading === user.id}
              >
                {isLoading === user.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Setujui
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRejectForm({ ...showRejectForm, [user.id]: true })}
              >
                <X className="mr-2 h-4 w-4" />
                Tolak
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
