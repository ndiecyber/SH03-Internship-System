import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { NavigationProgress } from "@/components/layout/navigation-progress";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationProgress />
      <AppSidebar />
      <div className="min-h-screen lg:pl-48">
        <TopNavbar />
        <main className="px-4 py-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
