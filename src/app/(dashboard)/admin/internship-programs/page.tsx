import { createPageMetadata } from "@/utils/create-page-metadata";
import { ProgramManager } from "@/features/internship-programs/components/program-manager";
import { getPrograms } from "@/features/internship-programs/services/program.actions";

export const metadata = createPageMetadata("Internship Programs");

export default async function InternshipProgramsPage() {
  const initialPrograms = await getPrograms();

  return <ProgramManager initialPrograms={initialPrograms} />;
}
