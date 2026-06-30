import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Logbook Review");

export default function LogbookReviewPage() {
  return <DashboardPlaceholder title="Logbook Review" />;
}
