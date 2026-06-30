import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Intern Logbook");

export default function InternLogbookPage() {
  return <DashboardPlaceholder title="Logbook" />;
}
