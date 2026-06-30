import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Settings");

export default function SettingsPage() {
  return <DashboardPlaceholder title="Settings" />;
}
