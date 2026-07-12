import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { roleNavigation } from "@/lib/navigation/role-navigation";
import { SidebarNav } from "./sidebar-nav";

export async function AppSidebar() {
  const session = await auth();
  const userRole = session?.user?.role || "INTERN";

  const currentSection = roleNavigation.find((s) => s.role === userRole);
  // Hanya pass plain objects ke Client Component
  const menuItems = (currentSection?.items ?? []).map((item) => ({
    label: item.label,
    href: item.href
  }));

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-48 flex-col border-r border-slate-800 bg-[#0f172a] text-slate-200 lg:flex z-30">

      {/* Logo */}
      <div className="flex flex-col items-start border-b border-slate-800 px-4 py-3 gap-1">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-lexa.png"
            alt="LEXA Technology"
            width={110}
            height={38}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Label */}
      <div className="flex flex-col items-start mt-4 px-4">
          <p className="text-white text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 leading-tight">
            INTERNSHIP
          </p>
          <p className="text-white text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 leading-tight">
            MANAGEMENT SYSTEM
          </p>
        </div>

      {/* Navigation — hanya pass plain objects */}
      <SidebarNav items={menuItems} />

      {/* Footer — user info */}
      <div className="border-t border-slate-800 px-3 py-3 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 shrink-0 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-semibold text-blue-400 text-xs">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate text-white">
              {session?.user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
