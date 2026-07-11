import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { roleNavigation } from "@/lib/navigation/role-navigation";
import { LayoutDashboard, Users, FileText, Settings, Award, GraduationCap, ClipboardList } from "lucide-react";
import type { ComponentType } from "react";

// Helper to match icon strings to Lucide icon components
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  "Dashboard": LayoutDashboard,
  "Registration": GraduationCap,
  "Logbook": ClipboardList,
  "Progress": FileText,
  "Certificate": Award,
  "Profile": Settings,
  "Assigned Interns": Users,
  "Logbook Review": ClipboardList,
  "Evaluation": FileText,
  "Applicants": Users,
  "Interns": Users,
  "Mentors": Users,
  "Programs": GraduationCap,
  "Monitoring": FileText,
  "Reports": ClipboardList,
  "Settings": Settings
};

export async function AppSidebar() {
  const session = await auth();
  const userRole = session?.user?.role || "INTERN";

  // Filter sections based on user role
  const currentSection = roleNavigation.find((section) => section.role === userRole);
  const menuItems = currentSection ? currentSection.items : [];

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-800 bg-[#0f172a] text-slate-200 lg:flex">
      {/* Logo Header */}
      <div className="flex flex-col items-start justify-center border-b border-slate-800 px-5 py-4 gap-1">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-lexa.png"
            alt="LEXA Technology"
            width={130}
            height={44}
            priority
            className="object-contain"
          />
        </Link>
        <div className="flex flex-col items-start mt-2.5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300 leading-tight">
            INTERNSHIP
          </p>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300 leading-tight">
            MANAGEMENT SYSTEM
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
          {currentSection?.label} Workspace
        </p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = iconMap[item.label] || ClipboardList;
            return (
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition duration-200"
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer / User Profile Info in Sidebar */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-9 w-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-semibold text-blue-400 text-sm">
            {session?.user?.name?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate uppercase tracking-wider">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
