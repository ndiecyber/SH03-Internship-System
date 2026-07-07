import { createPageMetadata } from "@/utils/create-page-metadata";
import { PageHeader } from "@/components/shared/page-header";
import { RegistrationApprovalContainer } from "@/features/admin/components/registration-approval-container";
import { RegistrationHistory } from "@/features/admin/components/registration-history";
import {
  getPendingRegistrations,
  getRegistrationHistory
} from "@/features/admin/services/registration-approval.actions";

export const metadata = createPageMetadata("Reports");

export default async function ReportsPage() {
  const [pendingResult, historyResult] = await Promise.all([
    getPendingRegistrations(),
    getRegistrationHistory()
  ]);

  const pendingUsers = pendingResult.data || [];
  const historyUsers = "data" in historyResult ? historyResult.data ?? [] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Kelola dan verifikasi registrasi pengguna yang menunggu persetujuan"
      />

      {/* Pending Approvals */}
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Persetujuan Registrasi Intern & Mentor
          </h2>
          <RegistrationApprovalContainer initialData={pendingUsers} />
        </div>
      </div>

      {/* Registration History */}
      <div className="rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Riwayat Registrasi</h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar semua registrasi yang telah diproses (disetujui atau ditolak).
          </p>
        </div>
        <RegistrationHistory history={historyUsers} />
      </div>
    </div>
  );
}
