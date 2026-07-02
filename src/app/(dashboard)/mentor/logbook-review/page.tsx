import { createPageMetadata } from "@/utils/create-page-metadata";
import { MentorLogbookReview } from "@/features/logbook/components/mentor-logbook-review";
import { getMentorLogbooks } from "@/features/logbook/services/logbook.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Logbook Review");

export default async function LogbookReviewPage() {
  const initialLogbooks = await getMentorLogbooks();

  return (
    <MentorLogbookReview
      initialLogbooks={
        initialLogbooks as unknown as ComponentProps<
          typeof MentorLogbookReview
        >["initialLogbooks"]
      }
    />
  );
}
