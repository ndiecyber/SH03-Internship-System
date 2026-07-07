import { createPageMetadata } from "@/utils/create-page-metadata";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { getProfileData } from "@/features/profile/services/profile.actions";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata("Mentor Profile");

export default async function MentorProfilePage() {
  const user = await getProfileData();
  if (!user) redirect("/login");

  return <ProfileForm user={user} />;
}
