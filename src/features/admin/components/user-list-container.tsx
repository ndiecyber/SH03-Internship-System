"use client";

import { useEffect, useState } from "react";
import { UserList } from "./user-list";
import { getUsersByRole } from "../services/user-management.actions";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { UserRole } from "@/types/roles";

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

interface UserListContainerProps {
  initialData: User[];
  role: UserRole;
  roleLabel: string;
}

export function UserListContainer({ initialData, role, roleLabel }: Readonly<UserListContainerProps>) {
  const [users, setUsers] = useState<User[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUsersByRole(role);
      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.data || []);
      }
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Gagal refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getUsersByRole(role).then((result) => {
        if (result.data) {
          setUsers(result.data);
        }
      });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [role]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">
          Total: <span className="font-semibold text-slate-900">{users.length}</span> {roleLabel}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      <UserList users={users} roleLabel={roleLabel} onRefresh={handleRefresh} />
    </div>
  );
}
