import { createPageMetadata } from "@/utils/create-page-metadata";
import { PageHeader } from "@/components/shared/page-header";
import { UserListContainer } from "@/features/admin/components/user-list-container";
import {
  getUsersByRole,
} from "@/features/admin/services/user-management.actions";

export const metadata = createPageMetadata("Interns");

export default async function InternsPage() {
  const [internResult, mentorResult] = await Promise.all([
    getUsersByRole("INTERN"),
    getUsersByRole("MENTOR")
  ]);

  const users = (internResult.data || []) as Parameters<typeof UserListContainer>[0]["initialData"];
  const mentors = (mentorResult.data || [])
    .filter((m) => m.approvalStatus === "APPROVED")
    .map((m) => ({ id: m.id, name: m.name, email: m.email }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interns"
        description="Kelola dan pantau semua akun peserta magang yang terdaftar"
      />

      <div className="rounded-lg border border-slate-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Daftar Peserta Magang (Interns)
        </h2>
        <UserListContainer
          initialData={users}
          role="INTERN"
          roleLabel="Intern"
          mentors={mentors}
        />
      </div>
    </div>
  );
}
