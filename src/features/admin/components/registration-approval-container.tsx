"use client";

import { useEffect, useState } from "react";
import { RegistrationApprovalList } from "./registration-approval-list";
import { getPendingRegistrations } from "../services/registration-approval.actions";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPendingRegistrations();
      if (result.error) {
        setError(result.error);
      } else {
        setPendingUsers(result.data || []);
      }
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Gagal refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 5 seconds when there are pending registrations
  useEffect(() => {
    if (pendingUsers.length === 0) return;

    const interval = setInterval(() => {
      getPendingRegistrations().then((result) => {
        if (result.data) {
          setPendingUsers(result.data);
        }
      });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [pendingUsers.length]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
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

      <RegistrationApprovalList pendingUsers={pendingUsers} onRefresh={handleRefresh} />
    </div>
  );
}
