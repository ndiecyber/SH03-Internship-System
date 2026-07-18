import { createPageMetadata } from "@/utils/create-page-metadata";
import { getPublishedAnnouncements } from "@/features/admin/services/announcement.actions";
import { Megaphone, Globe, UserCheck, Calendar, Clock, Link2 } from "lucide-react";

export const metadata = createPageMetadata("Announcements");

export default async function MentorAnnouncementsPage() {
  const items = await getPublishedAnnouncements("MENTOR");

  return (
    <div className="space-y-6">
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-blue-600" />
          Pengumuman
        </h1>
        <p className="text-sm text-slate-500 mt-1">Informasi dan pengumuman terbaru dari admin.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-white">
          <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Belum ada pengumuman.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  {item.audience === "mentors"
                    ? <UserCheck className="h-4 w-4 text-indigo-600" />
                    : <Globe className="h-4 w-4 text-indigo-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{item.message}</p>

                  {/* Event info */}
                  {(item.eventDate || item.eventTime || item.meetLink) && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2">
                      {item.eventDate && (
                        <span className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.eventDate).toLocaleDateString("id-ID", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric"
                          })}
                        </span>
                      )}
                      {item.eventTime && (
                        <span className="flex items-center gap-1.5 text-xs text-indigo-600">
                          <Clock className="h-3.5 w-3.5" />
                          {item.eventTime}
                        </span>
                      )}
                      {item.meetLink && (
                        <a
                          href={item.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          {item.meetLink.includes("discord") ? "Gabung Discord" : "Gabung Google Meet"}
                        </a>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric"
                    })}
                    {item.author.name && ` · ${item.author.name}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
