import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Intern Profile");

export default function InternProfilePage() {
  return <DashboardPlaceholder title="Profile" />;
}
