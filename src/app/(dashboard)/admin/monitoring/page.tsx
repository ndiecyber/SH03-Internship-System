import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Monitoring");

export default function MonitoringPage() {
  return <DashboardPlaceholder title="Monitoring" />;
}
