import { createPageMetadata } from "@/utils/create-page-metadata";
import { InternEvaluator } from "@/features/mentor/components/intern-evaluator";
import { getAssignedInterns } from "@/features/mentor/services/evaluation.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Evaluation");

export default async function EvaluationPage() {
  const initialInterns = await getAssignedInterns();

  return (
    <InternEvaluator
      initialInterns={
        initialInterns as unknown as ComponentProps<typeof InternEvaluator>["initialInterns"]
      }
    />
  );
}
