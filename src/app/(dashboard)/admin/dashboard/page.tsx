import { createPageMetadata } from "@/utils/create-page-metadata";
import { getDashboardStats } from "@/features/admin/services/dashboard.actions";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export const metadata = createPageMetadata("Admin Dashboard");

export default async function AdminDashboardPage() {
  const result = await getDashboardStats();
  const dashboardData = result.data || {
    totalApplicants: 0,
    activeInterns: 0,
    completedInterns: 0,
    totalCertificates: 0,
    pendingApprovals: 0,
    totalMentors: 0,
    pendingLogbooks: 0,
    latestLogbooks: []
  };

  return <AdminDashboard initialData={dashboardData} />;
}
