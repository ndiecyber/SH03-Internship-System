import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Applicants");

export default function ApplicantsPage() {
  return <DashboardPlaceholder title="Applicants" />;
}
