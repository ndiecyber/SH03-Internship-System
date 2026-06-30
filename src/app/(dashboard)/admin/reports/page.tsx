import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Reports");

export default function ReportsPage() {
  return <DashboardPlaceholder title="Reports" />;
}
