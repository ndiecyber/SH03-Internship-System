import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { SearchBar } from "./search-bar";
import { NotificationBell } from "./notification-bell";
import { prisma } from "@/lib/db";

export async function TopNavbar() {
  const session = await auth();
  const userRole = session?.user?.role || "INTERN";

  // Fetch notification counts — sequential to respect Vercel connection_limit=1
  let notifCount = 0;
  const notifItems: {
    id: string;
    label: string;
    description: string;
    href: string;
    icon: "approval" | "logbook";
  }[] = [];

  try {
    if (session?.user?.id) {
      if (userRole === "ADMIN") {
        const pendingApprovals = await prisma.user.count({
          where: { approvalStatus: "PENDING", role: { in: ["INTERN", "MENTOR"] } }
        });
        const pendingLogbooks = await prisma.logbook.count({
          where: { status: "pending" }
        });
        notifCount = pendingApprovals + pendingLogbooks;
        if (pendingApprovals > 0) notifItems.push({
          id: "approvals",
          label: `${pendingApprovals} Pending Registrations`,
          description: "Users waiting for approval",
          href: "/admin/reports",
          icon: "approval"
        });
        if (pendingLogbooks > 0) notifItems.push({
          id: "logbooks",
          label: `${pendingLogbooks} Logbooks to Review`,
          description: "Intern logbooks waiting for review",
          href: "/admin/monitoring",
          icon: "logbook"
        });
      } else if (userRole === "MENTOR") {
        const pendingLogbooks = await prisma.logbook.count({
          where: {
            status: "pending",
            user: { internRelation: { mentorId: session.user.id } }
          }
        });
        notifCount = pendingLogbooks;
        if (pendingLogbooks > 0) notifItems.push({
          id: "logbooks",
          label: `${pendingLogbooks} Logbooks to Review`,
          description: "Intern logbooks waiting for your review",
          href: "/mentor/logbook-review",
          icon: "logbook"
        });
      } else if (userRole === "INTERN") {
        const pendingApps = await prisma.application.count({
          where: { userId: session.user.id, status: "pending" }
        });
        notifCount = pendingApps;
        if (pendingApps > 0) notifItems.push({
          id: "apps",
          label: `${pendingApps} Application Pending`,
          description: "Your application is under review",
          href: "/intern/internship-registration",
          icon: "approval"
        });
      }
    }
  } catch {
    // Silently fail — notif non-critical, jangan crash navbar
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-white/95 px-4 backdrop-blur lg:px-6 shadow-sm gap-3">

      {/* Mobile logo */}
      <Link className="flex items-center gap-2 lg:hidden shrink-0" href="/">
        <Image
          src="/logo-lexa.png"
          alt="LEXA Technology"
          width={80}
          height={28}
          priority
          className="object-contain"
        />
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Bar */}
      <SearchBar />

      {/* Notification Bell */}
      <NotificationBell count={notifCount} items={notifItems} />

    </header>
  );
}
