import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Intern Progress");

export default function InternProgressPage() {
  return <DashboardPlaceholder title="Progress" />;
}
