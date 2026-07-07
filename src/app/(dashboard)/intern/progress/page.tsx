import { createPageMetadata } from "@/utils/create-page-metadata";
import { InternProgress } from "@/features/intern/components/intern-progress";
import { getInternProgressData } from "@/features/intern/services/progress.actions";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata("Intern Progress");

export default async function InternProgressPage() {
  const data = await getInternProgressData();
  if (!data) redirect("/login");
  return <InternProgress data={data} />;
}
