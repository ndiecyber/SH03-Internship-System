"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, Settings,
  Award, GraduationCap, ClipboardList
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Dashboard":        LayoutDashboard,
  "Registration":     GraduationCap,
  "Logbook":          ClipboardList,
  "Progress":         FileText,
  "Certificate":      Award,
  "Profile":          Settings,
  "Assigned Interns": Users,
  "Logbook Review":   ClipboardList,
  "Evaluation":       FileText,
  "Applicants":       Users,
  "Interns":          Users,
  "Mentors":          Users,
  "Programs":         GraduationCap,
  "Monitoring":       FileText,
  "Reports":          ClipboardList,
  "Settings":         Settings
};

interface NavItem {
  label: string;
  href: string;
}

export function SidebarNav({ items }: Readonly<{ items: NavItem[] }>) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto">
      {items.map((item) => {
        const Icon = iconMap[item.label] || ClipboardList;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
