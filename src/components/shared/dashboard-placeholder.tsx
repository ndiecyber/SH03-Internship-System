import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";

export function DashboardPlaceholder({ title }: Readonly<{ title: string }>) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description="Business workflows will be implemented in this module." />
      <PlaceholderPanel label={`${title} module placeholder`} />
    </div>
  );
}
