import { createPageMetadata } from "@/utils/create-page-metadata";
import { InternLogbook } from "@/features/logbook/components/intern-logbook";
import { getInternLogbooks } from "@/features/logbook/services/logbook.actions";
import type { ComponentProps } from "react";

export const metadata = createPageMetadata("Logbook");

export default async function LogbookPage() {
  const initialLogbooks = await getInternLogbooks();

  return (
    <InternLogbook
      initialLogbooks={
        initialLogbooks as unknown as ComponentProps<typeof InternLogbook>["initialLogbooks"]
      }
    />
  );
}
