import { createPageMetadata } from "@/utils/create-page-metadata";
import { GoogleDriveInterns } from "@/features/admin/components/google-drive-interns";
import { getUsersByRole } from "@/features/admin/services/user-management.actions";

export const metadata = createPageMetadata("Google Drive Interns");

export default async function GoogleDriveInternsPage() {
  const result = await getUsersByRole("INTERN");
  const interns = (result.data ?? []).filter((user) => !user.googleDriveRegistered).map((user) => ({ id: user.id, name: user.name, email: user.email, institution: user.institution, studyProgram: user.studyProgram }));
  return <GoogleDriveInterns initialInterns={interns} />;
}
