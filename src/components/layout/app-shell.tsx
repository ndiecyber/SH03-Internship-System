import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />
      <div className="min-h-screen lg:pl-48">
        <TopNavbar />
        <main className="px-6 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
