"use client";

import { useState } from "react";
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { deleteUser, assignMentorToIntern, unassignMentorFromIntern } from "../services/user-management.actions";
import {
  Trash2, Loader2, CheckCircle, Clock, XCircle,
  ExternalLink, UserCheck, UserX, Award
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  cvUrl: string | null;
  createdAt: Date;
  program: { title: string };
}

interface Mentor {
  id: string;
  name: string | null;
  email: string;
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
  assignedMentor?: Mentor | null;
  assignedInterns?: { id: string; name: string | null; email: string }[];
  certificate?: { certNumber: string; issuedAt: Date } | null;
}

interface UserListProps {
  users: User[];
  roleLabel: string;
  mentors?: Mentor[]; // available mentors for dropdown (INTERN role only)
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

export function UserList({ users, roleLabel, mentors, onRefresh }: Readonly<UserListProps>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  // track selected mentor per intern card
  const [selectedMentor, setSelectedMentor] = useState<Record<string, string>>({});
  // track optimistic assigned mentor per intern
  const [assignedMentors, setAssignedMentors] = useState<Record<string, Mentor | null>>(() => {
    const map: Record<string, Mentor | null> = {};
    users.forEach((u) => {
      if (u.assignedMentor !== undefined) map[u.id] = u.assignedMentor ?? null;
    });
    return map;
  });

  const handleDelete = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    setDeletingId(userId);
    const result = await deleteUser(userId);
    setDeletingId(null);
    if (result.success) onRefresh?.();
  };

  const handleAssign = async (internId: string) => {
    const mentorId = selectedMentor[internId];
    if (!mentorId) return;
    setAssigningId(internId);
    const res = await assignMentorToIntern(internId, mentorId);
    if (res.error) {
      alert(res.error);
    } else {
      const mentor = mentors?.find((m) => m.id === mentorId) ?? null;
      setAssignedMentors((prev) => ({ ...prev, [internId]: mentor }));
      setSelectedMentor((prev) => { const n = { ...prev }; delete n[internId]; return n; });
    }
    setAssigningId(null);
  };

  const handleUnassign = async (internId: string) => {
    setAssigningId(internId);
    const res = await unassignMentorFromIntern(internId);
    if (res.error) {
      alert(res.error);
    } else {
      setAssignedMentors((prev) => ({ ...prev, [internId]: null }));
    }
    setAssigningId(null);
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
      {users.map((user) => {
        const isDeleting = deletingId === user.id;
        const isAssigning = assigningId === user.id;
        const currentMentor = assignedMentors[user.id] !== undefined
          ? assignedMentors[user.id]
          : user.assignedMentor ?? null;
        const chosenMentorId = selectedMentor[user.id] ?? "";
        // Only show mentor assignment for interns who are account-approved AND have an approved application (CV)
        const hasApprovedApplication = user.applications?.some((a) => a.status === "approved");
        const showMentorControl =
          mentors &&
          mentors.length > 0 &&
          user.approvalStatus === "APPROVED" &&
          hasApprovedApplication;

        return (
          <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

              {/* Left — info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{user.name || "Nama tidak tersedia"}</h3>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>

                {/* Application status — only relevant for interns */}
                {user.role !== "MENTOR" && getApplicationBadge(user.applications)}

                {/* Certificate badge — shown when intern has completed */}
                {user.role !== "MENTOR" && user.certificate && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                    <Award className="h-3.5 w-3.5" />
                    Selesai — {user.certificate.certNumber}
                  </span>
                )}

                {/* CV link — only relevant for interns */}
                {user.role !== "MENTOR" && user.applications?.[0]?.cvUrl && user.applications[0].status === "pending" && (
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

                {/* Account status + date */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400">
                    Akun:{" "}
                    <span className={user.approvalStatus === "APPROVED" ? "text-emerald-600 font-medium" : "text-slate-500"}>
                      {user.approvalStatus}
                    </span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Daftar: {formatDate(new Date(user.createdAt))}
                  </span>
                </div>

                {/* Assigned interns — only for MENTOR role */}
                {user.role === "MENTOR" && (
                  <div className="pt-1.5 border-t border-slate-100 mt-1">
                    <p className="text-xs font-semibold text-slate-500 mb-1.5">
                      Peserta yang dibimbing ({user.assignedInterns?.length ?? 0})
                    </p>
                    {user.assignedInterns && user.assignedInterns.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {user.assignedInterns.map((intern) => (
                          <span
                            key={intern.id}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                          >
                            <UserCheck className="h-3 w-3" />
                            {intern.name ?? intern.email}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Belum ada peserta yang ditugaskan</span>
                    )}
                  </div>
                )}

                {/* ── Mentor assignment inline ── */}
                {showMentorControl && (
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      {currentMentor ? (
                        <>
                          <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-700">
                            Mentor: {currentMentor.name ?? currentMentor.email}
                          </span>
                        </>
                      ) : (
                        <>
                          <UserX className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs text-slate-400">Belum ditugaskan mentor</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={chosenMentorId}
                        onChange={(e) =>
                          setSelectedMentor((prev) => ({ ...prev, [user.id]: e.target.value }))
                        }
                        disabled={isAssigning}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      >
                        <option value="">-- Pilih Mentor --</option>
                        {mentors.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name ?? m.email}
                          </option>
                        ))}
                      </select>

                      <Button
                        size="sm"
                        onClick={() => handleAssign(user.id)}
                        disabled={!chosenMentorId || isAssigning}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                      >
                        {isAssigning ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          currentMentor ? "Ganti Mentor" : "Assign"
                        )}
                      </Button>

                      {currentMentor && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnassign(user.id)}
                          disabled={isAssigning}
                          className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-7 px-3"
                        >
                          {isAssigning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Hapus Penugasan"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — delete */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(user.id)}
                disabled={isDeleting}
                className="border-red-300 text-red-700 hover:bg-red-50 shrink-0 self-start"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Trash2 className="mr-1.5 h-4 w-4" />Hapus</>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
