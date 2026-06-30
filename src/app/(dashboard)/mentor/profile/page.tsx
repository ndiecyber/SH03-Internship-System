import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Mentor Profile");

export default function MentorProfilePage() {
  return <DashboardPlaceholder title="Profile" />;
}
