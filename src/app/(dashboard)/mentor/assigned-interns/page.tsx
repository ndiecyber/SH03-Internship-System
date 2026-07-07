import { createPageMetadata } from "@/utils/create-page-metadata";
import { AssignedInternsList } from "@/features/mentor/components/assigned-interns-list";
import { getAssignedInternsWithDetail } from "@/features/mentor/services/evaluation.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Assigned Interns");

export default async function AssignedInternsPage() {
  const interns = await getAssignedInternsWithDetail();
  return (
    <AssignedInternsList
      interns={interns as unknown as ComponentProps<typeof AssignedInternsList>["interns"]}
    />
  );
}
