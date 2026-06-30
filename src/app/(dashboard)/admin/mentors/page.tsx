import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Mentors");

export default function MentorsPage() {
  return <DashboardPlaceholder title="Mentors" />;
}
