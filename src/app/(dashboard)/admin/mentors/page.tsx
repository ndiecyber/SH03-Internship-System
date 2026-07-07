import { createPageMetadata } from "@/utils/create-page-metadata";
import { PageHeader } from "@/components/shared/page-header";
import { UserListContainer } from "@/features/admin/components/user-list-container";
import { getUsersByRole } from "@/features/admin/services/user-management.actions";

export const metadata = createPageMetadata("Mentors");

export default async function MentorsPage() {
  const result = await getUsersByRole("MENTOR");
  const users = result.data || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mentors" 
        description="Kelola dan pantau semua akun mentor yang terdaftar"
      />
      
      <div className="rounded-lg border border-slate-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Daftar Mentor</h2>
        <UserListContainer initialData={users} role="MENTOR" roleLabel="Mentor" />
      </div>
    </div>
  );
}
