"use client";

import { useEffect, useState } from "react";
import { RegistrationApprovalList } from "./registration-approval-list";
import { getPendingRegistrations } from "../services/registration-approval.actions";

interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

interface RegistrationApprovalContainerProps {
  initialData: PendingUser[];
}

export function RegistrationApprovalContainer({ initialData }: Readonly<RegistrationApprovalContainerProps>) {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(initialData);

  // Auto-refresh every 5 seconds when there are pending registrations
  useEffect(() => {
    if (pendingUsers.length === 0) return;

    const interval = setInterval(() => {
      getPendingRegistrations().then((result) => {
        if (result.data) setPendingUsers(result.data);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [pendingUsers.length]);

  const handleRefreshed = (updated: PendingUser[]) => {
    setPendingUsers(updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-slate-800">{pendingUsers.length}</span> registrasi menunggu persetujuan
      </p>
      <RegistrationApprovalList
        pendingUsers={pendingUsers}
        onRefresh={() => {
          getPendingRegistrations().then((r) => {
            if (r.data) handleRefreshed(r.data);
          });
        }}
      />
    </div>
  );
}
