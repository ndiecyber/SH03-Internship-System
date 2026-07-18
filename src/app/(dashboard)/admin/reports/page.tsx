import { createPageMetadata } from "@/utils/create-page-metadata";
import { AdminReports } from "@/features/admin/components/admin-reports";
import {
  getPendingRegistrations,
  getRegistrationHistory,
} from "@/features/admin/services/registration-approval.actions";

export const metadata = createPageMetadata("Reports");

export default async function ReportsPage() {
  const [pendingResult, historyResult] = await Promise.all([
    getPendingRegistrations(),
    getRegistrationHistory(),
  ]);

  const pendingUsers = pendingResult.data ?? [];
  const historyUsers = "data" in historyResult ? historyResult.data ?? [] : [];

  return (
    <AdminReports
      initialPending={pendingUsers}
      initialHistory={historyUsers}
    />
  );
}
