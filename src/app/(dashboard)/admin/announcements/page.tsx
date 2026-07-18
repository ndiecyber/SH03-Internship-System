import { createPageMetadata } from "@/utils/create-page-metadata";
import { PageHeader } from "@/components/shared/page-header";
import { getAnnouncements } from "@/features/admin/services/announcement.actions";
import { AnnouncementManager } from "@/features/admin/components/announcement-manager";

export const metadata = createPageMetadata("Announcements");

export default async function AdminAnnouncementsPage() {
  const result = await getAnnouncements();
  const data = result.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Buat dan kelola pengumuman untuk intern dan mentor"
      />
      <div className="rounded-lg border border-slate-200 p-6">
        <AnnouncementManager initialData={data} />
      </div>
    </div>
  );
}
