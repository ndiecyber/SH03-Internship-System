import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Certificate");

export default function CertificatePage() {
  return <DashboardPlaceholder title="Certificate" />;
}
