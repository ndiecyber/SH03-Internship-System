import { createPageMetadata } from "@/utils/create-page-metadata";
import { PageHeader } from "@/components/shared/page-header";
import { UserListContainer } from "@/features/admin/components/user-list-container";
import { MentorAssignment } from "@/features/admin/components/mentor-assignment";
import {
  getUsersByRole,
  getMentorInternAssignments
} from "@/features/admin/services/user-management.actions";

export const metadata = createPageMetadata("Interns");

export default async function InternsPage() {
  const [internResult, assignmentResult, mentorResult] = await Promise.all([
    getUsersByRole("INTERN"),
    getMentorInternAssignments(),
    getUsersByRole("MENTOR")
  ]);

  const users = internResult.data || [];
  const assignedInterns = "data" in assignmentResult ? assignmentResult.data ?? [] : [];
  const mentors = mentorResult.data || [];

  // Filter only APPROVED mentors for the dropdown
  const approvedMentors = mentors.filter((m) => m.approvalStatus === "APPROVED");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interns"
        description="Kelola dan pantau semua akun peserta magang yang terdaftar"
      />

      <div className="rounded-lg border border-slate-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Daftar Peserta Magang (Interns)</h2>
        <UserListContainer initialData={users} role="INTERN" roleLabel="Intern" />
      </div>

      <div className="rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Penugasan Mentor</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tugaskan mentor kepada peserta magang yang telah disetujui.
          </p>
        </div>
        <MentorAssignment interns={assignedInterns} mentors={approvedMentors} />
      </div>
    </div>
  );
}
