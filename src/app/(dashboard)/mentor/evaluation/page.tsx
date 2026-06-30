import { createPageMetadata } from "@/utils/create-page-metadata";
import { DashboardPlaceholder } from "@/components/shared/dashboard-placeholder";

export const metadata = createPageMetadata("Evaluation");

export default function EvaluationPage() {
  return <DashboardPlaceholder title="Evaluation" />;
}
