import { createPageMetadata } from "@/utils/create-page-metadata";
import { InternCertificate } from "@/features/intern/components/intern-certificate";
import { getInternCertificate } from "@/features/intern/services/certificate.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Certificate");

export default async function CertificatePage() {
  const certificate = await getInternCertificate();

  return (
    <InternCertificate
      certificate={
        certificate as unknown as ComponentProps<typeof InternCertificate>["certificate"]
      }
    />
  );
}
