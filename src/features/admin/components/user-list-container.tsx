"use client";

import { useEffect, useState } from "react";
import { UserList } from "./user-list";
import { getUsersByRole } from "../services/user-management.actions";
import { AlertCircle, Search, Users } from "lucide-react";
import { UserRole } from "@/types/roles";

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
}

interface UserListContainerProps {
  initialData: User[];
  role: UserRole;
  roleLabel: string;
  mentors?: Mentor[];
}

export function UserListContainer({
  initialData,
  role,
  roleLabel,
  mentors,
}: Readonly<UserListContainerProps>) {
  const [users, setUsers] = useState<User[]>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getUsersByRole(role).then((result) => {
        if (result.data) setUsers(result.data as User[]);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [role]);

  // Filter counts
  const countAll = users.length;
  const countAktif = users.filter((u) =>
    u.applications?.some((a) => a.status === "approved")
  ).length;
  const countBelumDaftar = users.filter(
    (u) => !u.applications || u.applications.length === 0
  ).length;

  const tabs = [
    { id: "all", label: "Semua", count: countAll },
    { id: "aktif", label: "Peserta Aktif", count: countAktif },
    { id: "belum", label: "Belum Daftar", count: countBelumDaftar },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "aktif" && u.applications?.some((a) => a.status === "approved")) ||
      (filterStatus === "belum" && (!u.applications || u.applications.length === 0));

    const matchesSearch =
      !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Search & Filter — sama persis dengan applicant-manager */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div className="flex gap-2 border-b md:border-b-0 pb-2 md:pb-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                  filterStatus === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filterStatus === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-slate-600">
        Menampilkan{" "}
        <span className="font-semibold text-slate-900">{filteredUsers.length}</span>{" "}
        dari{" "}
        <span className="font-semibold text-slate-900">{countAll}</span>{" "}
        {roleLabel}
      </p>

      {/* Empty state */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">
            Tidak ada {roleLabel} ditemukan.
          </p>
        </div>
      ) : (
        <UserList
          users={filteredUsers}
          roleLabel={roleLabel}
          mentors={mentors}
          onRefresh={() => {}}
        />
      )}
    </div>
  );
}
