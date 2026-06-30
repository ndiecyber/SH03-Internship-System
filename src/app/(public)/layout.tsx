import type { ReactNode } from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      {children}
    </div>
  );
}
