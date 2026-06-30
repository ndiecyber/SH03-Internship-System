import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Mentor Dashboard");

export default function MentorDashboardPage() {
  return <DashboardPlaceholder title="Mentor Dashboard" />;
}
