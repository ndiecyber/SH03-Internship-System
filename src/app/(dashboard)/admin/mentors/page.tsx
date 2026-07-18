import { createPageMetadata } from "@/utils/create-page-metadata";
import { MentorListContainer } from "@/features/admin/components/mentor-list-container";
import { getUsersByRole } from "@/features/admin/services/user-management.actions";
import { getPrograms } from "@/features/internship-programs/services/program.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Mentors");

export default async function MentorsPage() {
  const [mentorResult, programsResult] = await Promise.all([
    getUsersByRole("MENTOR"),
    getPrograms(),
  ]);

  const mentors = (mentorResult.data || []) as ComponentProps<typeof MentorListContainer>["initialData"];

  const programs = (Array.isArray(programsResult) ? programsResult : []).map(p => ({
    id: p.id,
    title: p.title,
  }));

  return (
    <MentorListContainer
      initialData={mentors}
      programs={programs}
    />
  );
}
