import { createPageMetadata } from "@/utils/create-page-metadata";
import { AdminMonitoring } from "@/features/admin/components/admin-monitoring";
import { getAdminMonitoringLogbooks } from "@/features/admin/services/monitoring.actions";

export const metadata = createPageMetadata("Monitoring");

export default async function MonitoringPage() {
  const result = await getAdminMonitoringLogbooks();

  if ("error" in result) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {result.error}
      </div>
    );
  }

  return <AdminMonitoring logbooks={result.data} />;
}
