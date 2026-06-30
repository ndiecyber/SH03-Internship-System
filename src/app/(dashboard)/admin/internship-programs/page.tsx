import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Internship Programs");

export default function InternshipProgramsPage() {
  return <DashboardPlaceholder title="Internship Programs" />;
}
