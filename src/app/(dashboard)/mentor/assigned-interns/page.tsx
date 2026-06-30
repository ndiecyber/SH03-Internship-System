import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Assigned Interns");

export default function AssignedInternsPage() {
  return <DashboardPlaceholder title="Assigned Interns" />;
}
