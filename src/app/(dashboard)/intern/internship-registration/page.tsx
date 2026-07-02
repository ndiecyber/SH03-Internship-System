import { createPageMetadata } from "@/utils/create-page-metadata";
import { InternRegistration } from "@/features/internship-programs/components/intern-registration";
import { getPublishedPrograms, getInternApplications } from "@/features/internship-programs/services/application.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Internship Registration");

export default async function InternshipRegistrationPage() {
  const [programs, applications] = await Promise.all([
    getPublishedPrograms(),
    getInternApplications()
  ]);

  return (
    <InternRegistration
      programs={programs}
      applications={
        applications as unknown as ComponentProps<
          typeof InternRegistration
        >["applications"]
      }
    />
  );
}
