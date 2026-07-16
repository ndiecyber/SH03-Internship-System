import { createPageMetadata } from "@/utils/create-page-metadata";
import { InternLogbook } from "@/features/logbook/components/intern-logbook";
import { getInternLogbooks } from "@/features/logbook/services/logbook.actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Logbook");

export default async function LogbookPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const initialLogbooks = await getInternLogbooks();
  const mentorAssignment = userId
    ? await prisma.mentorIntern.findUnique({
        where: { internId: userId },
        include: { mentor: { select: { name: true, email: true } } }
      })
    : null;

  return (
    <InternLogbook
      initialLogbooks={
        initialLogbooks as unknown as ComponentProps<typeof InternLogbook>["initialLogbooks"]
      }
      hasMentor={!!mentorAssignment}
      mentorName={mentorAssignment?.mentor?.name ?? mentorAssignment?.mentor?.email ?? null}
    />
  );
}
