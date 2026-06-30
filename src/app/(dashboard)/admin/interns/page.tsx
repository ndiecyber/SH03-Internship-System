import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Interns");

export default function InternsPage() {
  return <DashboardPlaceholder title="Interns" />;
}
