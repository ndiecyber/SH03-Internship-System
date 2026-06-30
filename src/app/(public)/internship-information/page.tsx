import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";

export default function InternshipInformationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageHeader title="Internship Information" description="Public program information and requirements." />
      <PlaceholderPanel label="Program information content placeholder" />
    </main>
  );
}
