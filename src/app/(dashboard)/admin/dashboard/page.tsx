import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Admin Dashboard");

export default function AdminDashboardPage() {
  return <DashboardPlaceholder title="Admin Dashboard" />;
}
