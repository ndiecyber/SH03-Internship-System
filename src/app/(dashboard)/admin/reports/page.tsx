import { createPageMetadata } from "@/utils/create-page-metadata";
import { PageHeader } from "@/components/shared/page-header";
import { RegistrationApprovalContainer } from "@/features/admin/components/registration-approval-container";
import { getPendingRegistrations } from "@/features/admin/services/registration-approval.actions";

export const metadata = createPageMetadata("Reports");

export default async function ReportsPage() {
  const result = await getPendingRegistrations();
  const pendingUsers = result.data || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports" 
        description="Kelola dan verifikasi registrasi pengguna yang menunggu persetujuan"
      />
      
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Persetujuan Registrasi Intern & Mentor
          </h2>
          <RegistrationApprovalContainer initialData={pendingUsers} />
        </div>
      </div>
    </div>
  );
}

