import type { UserRole } from "@/types/roles";

export type NavigationItem = {
  href: string;
  label: string;
};

export type NavigationSection = {
  role: UserRole;
  label: string;
  items: NavigationItem[];
};
