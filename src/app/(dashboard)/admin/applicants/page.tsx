import { createPageMetadata } from "@/utils/create-page-metadata";
import { ApplicantManager } from "@/features/admin/components/applicant-manager";
import { getAllApplications } from "@/features/admin/services/applicant.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Applicants");

export default async function ApplicantsPage() {
  const initialApplications = await getAllApplications();

  return (
    <ApplicantManager
      initialApplications={
        initialApplications as unknown as ComponentProps<
          typeof ApplicantManager
        >["initialApplications"]
      }
    />
  );
}
